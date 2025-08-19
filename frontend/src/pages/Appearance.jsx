// pages/Appearance.jsx
import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { 
  Palette, 
  Monitor, 
  Sun, 
  Moon, 
  Smartphone, 
  Save, 
  X,
  Eye,
  Zap,
  Contrast,
  Type,
  Layout,
  Settings as SettingsIcon
} from "lucide-react";
import { setUser } from "../store/slices/userSlice";
import { set } from "../store/slices/uiSlice";
import axios from "axios";
import ProfileNavigation from "../components/ProfileNavigation";

export default function Appearance() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user, token } = useSelector((state) => state.user);
  const ui = useSelector((state) => state.ui);
  
  // Refs for navbar
  const notificationsRef = useRef(null);
  const profileMenuRef = useRef(null);
  
  // Mock data for navbar
  const notifications = [];
  const unreadNotifications = 0;

  // Appearance settings state
  const [appearanceSettings, setAppearanceSettings] = useState({
    // Theme Settings
    theme: 'auto', // 'light', 'dark', 'auto'
    accentColor: 'blue', // 'blue', 'green', 'purple', 'orange', 'pink', 'red'
    
    // Display Settings
    fontSize: 'medium', // 'small', 'medium', 'large', 'extra-large'
    compactMode: false,
    animations: true,
    transparency: true,
    
    // Chat Appearance
    chatBackground: 'default', // 'default', 'gradient', 'image'
    messageGrouping: true,
    showTimestamps: true,
    showAvatars: true,
    emojiStyle: 'system', // 'system', 'twitter', 'apple', 'google'
    
    // Accessibility
    highContrast: false,
    reducedMotion: false,
    colorBlindMode: 'none', // 'none', 'protanopia', 'deuteranopia', 'tritanopia'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [originalSettings, setOriginalSettings] = useState({});

  // Theme options
  const themeOptions = [
    { id: 'light', name: 'Light', icon: Sun, description: 'Clean and bright interface' },
    { id: 'dark', name: 'Dark', icon: Moon, description: 'Easy on the eyes' },
    { id: 'auto', name: 'Auto', icon: Monitor, description: 'Matches system preference' },
  ];

  // Accent color options
  const accentColors = [
    { id: 'blue', name: 'Blue', color: 'bg-blue-500' },
    { id: 'green', name: 'Green', color: 'bg-green-500' },
    { id: 'purple', name: 'Purple', color: 'bg-purple-500' },
    { id: 'orange', name: 'Orange', color: 'bg-orange-500' },
    { id: 'pink', name: 'Pink', color: 'bg-pink-500' },
    { id: 'red', name: 'Red', color: 'bg-red-500' },
  ];

  // Font size options
  const fontSizeOptions = [
    { id: 'small', name: 'Small', size: '14px' },
    { id: 'medium', name: 'Medium', size: '16px' },
    { id: 'large', name: 'Large', size: '18px' },
    { id: 'extra-large', name: 'Extra Large', size: '20px' },
  ];

  // Load appearance settings on mount
  useEffect(() => {
    if (user) {
      const userAppearanceSettings = {
        theme: user.appearanceSettings?.theme ?? 'auto',
        accentColor: user.appearanceSettings?.accentColor ?? 'blue',
        fontSize: user.appearanceSettings?.fontSize ?? 'medium',
        compactMode: user.appearanceSettings?.compactMode ?? false,
        animations: user.appearanceSettings?.animations ?? true,
        transparency: user.appearanceSettings?.transparency ?? true,
        chatBackground: user.appearanceSettings?.chatBackground ?? 'default',
        messageGrouping: user.appearanceSettings?.messageGrouping ?? true,
        showTimestamps: user.appearanceSettings?.showTimestamps ?? true,
        showAvatars: user.appearanceSettings?.showAvatars ?? true,
        emojiStyle: user.appearanceSettings?.emojiStyle ?? 'system',
        highContrast: user.appearanceSettings?.highContrast ?? false,
        reducedMotion: user.appearanceSettings?.reducedMotion ?? false,
        colorBlindMode: user.appearanceSettings?.colorBlindMode ?? 'none',
      };
      
      setAppearanceSettings(userAppearanceSettings);
      setOriginalSettings(userAppearanceSettings);
      setPageLoading(false);
    }
  }, [user]);

  // Click outside detection
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        dispatch(set({ key: "showProfileMenu", value: false }));
      }
      
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        dispatch(set({ key: "showNotifications", value: false }));
      }
    };

    if (ui.showProfileMenu || ui.showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ui.showProfileMenu, ui.showNotifications, dispatch]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(setUser(null));
    dispatch(set({ key: "showProfileMenu", value: false }));
    navigate('/');
  };

  const handleToggle = (key) => {
    setAppearanceSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelect = (key, value) => {
    setAppearanceSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!token) {
      alert("No authentication token found");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.put(
        "http://localhost:3000/api/v1/users/appearance",
        appearanceSettings,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        }
      );

      if (response.data.success) {
        dispatch(setUser(response.data.user));
        setOriginalSettings(appearanceSettings);
        alert("Appearance settings saved successfully!");
      }
      
    } catch (error) {
      console.error("Appearance save error:", error);
      alert(error.response?.data?.message || "Failed to save appearance settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setAppearanceSettings(originalSettings);
  };

  if (pageLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading appearance settings...</div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center">
        <div className="text-red-500 text-xl">Please log in to access appearance settings.</div>
      </main>
    );
  }

  return (
    <>
      <ProfileNavigation
        user={user}
        showNotifications={ui.showNotifications}
        setShowNotifications={(val) => dispatch(set({ key: "showNotifications", value: val }))}
        showProfileMenu={ui.showProfileMenu}
        setShowProfileMenu={(val) => dispatch(set({ key: "showProfileMenu", value: val }))}
        showMobileMenu={ui.showMobileMenu}
        setShowMobileMenu={(val) => dispatch(set({ key: "showMobileMenu", value: val }))}
        showChannels={ui.showChannels}
        setShowChannels={(val) => dispatch(set({ key: "showChannels", value: val }))}
        notifications={notifications}
        unreadNotifications={unreadNotifications}
        notificationsRef={notificationsRef}
        profileMenuRef={profileMenuRef}
        handleLogout={handleLogout} 
      />
      
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 py-12 px-6 pt-20">
        {/* Page Header */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="text-center mb-2">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight flex items-center justify-center gap-3">
              <Palette className="w-10 h-10 text-purple-400" />
              Appearance
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-500 mx-auto rounded-full"></div>
          </div>
          <p className="text-gray-400 text-center mt-6 text-lg">
            Customize how Zuno looks and feels
          </p>
        </div>

        {/* Appearance Content */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Theme Selection */}
            <section className="bg-gray-900/80 backdrop-blur-lg rounded-3xl border border-gray-700/50 shadow-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Contrast className="w-6 h-6 text-purple-400" />
                <h2 className="text-2xl font-bold text-white">Theme</h2>
              </div>
              
              <div className="space-y-4">
                {themeOptions.map((theme) => {
                  const IconComponent = theme.icon;
                  return (
                    <div
                      key={theme.id}
                      onClick={() => handleSelect('theme', theme.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                        appearanceSettings.theme === theme.id
                          ? 'border-purple-400 bg-purple-400/10 shadow-md shadow-purple-400/20'
                          : 'border-gray-700/30 bg-gray-800/50 hover:border-gray-600 hover:bg-gray-800/70'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <IconComponent className={`w-5 h-5 ${
                          appearanceSettings.theme === theme.id ? 'text-purple-400' : 'text-gray-400'
                        }`} />
                        <div>
                          <h3 className="text-white font-medium">{theme.name}</h3>
                          <p className="text-gray-400 text-sm">{theme.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Accent Color */}
            <section className="bg-gray-900/80 backdrop-blur-lg rounded-3xl border border-gray-700/50 shadow-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Palette className="w-6 h-6 text-pink-400" />
                <h2 className="text-2xl font-bold text-white">Accent Color</h2>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                {accentColors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => handleSelect('accentColor', color.id)}
                    className={`p-4 rounded-xl border transition-all duration-200 ${
                      appearanceSettings.accentColor === color.id
                        ? 'border-white shadow-lg'
                        : 'border-gray-700/30 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className={`w-8 h-8 rounded-full ${color.color}`}></div>
                      <span className="text-white text-sm font-medium">{color.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* Display Settings */}
            <section className="bg-gray-900/80 backdrop-blur-lg rounded-3xl border border-gray-700/50 shadow-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Layout className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">Display</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-300 font-medium mb-3">Font Size</label>
                  <div className="grid grid-cols-2 gap-3">
                    {fontSizeOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleSelect('fontSize', option.id)}
                        className={`p-3 rounded-lg border transition-all duration-200 ${
                          appearanceSettings.fontSize === option.id
                            ? 'border-blue-400 bg-blue-400/10 text-blue-400'
                            : 'border-gray-700/30 bg-gray-800/50 text-gray-300 hover:border-gray-600'
                        }`}
                        style={{ fontSize: option.size }}
                      >
                        {option.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700/30">
                  <div>
                    <h3 className="text-white font-medium">Compact Mode</h3>
                    <p className="text-gray-400 text-sm">Reduce spacing between messages</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={appearanceSettings.compactMode}
                      onChange={() => handleToggle('compactMode')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700/30">
                  <div>
                    <h3 className="text-white font-medium">Animations</h3>
                    <p className="text-gray-400 text-sm">Enable smooth transitions and effects</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={appearanceSettings.animations}
                      onChange={() => handleToggle('animations')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                  </label>
                </div>
              </div>
            </section>

            {/* Accessibility */}
            <section className="bg-gray-900/80 backdrop-blur-lg rounded-3xl border border-gray-700/50 shadow-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Eye className="w-6 h-6 text-green-400" />
                <h2 className="text-2xl font-bold text-white">Accessibility</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700/30">
                  <div>
                    <h3 className="text-white font-medium">High Contrast</h3>
                    <p className="text-gray-400 text-sm">Increase contrast for better visibility</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={appearanceSettings.highContrast}
                      onChange={() => handleToggle('highContrast')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700/30">
                  <div>
                    <h3 className="text-white font-medium">Reduce Motion</h3>
                    <p className="text-gray-400 text-sm">Minimize animations and transitions</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={appearanceSettings.reducedMotion}
                      onChange={() => handleToggle('reducedMotion')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                  </label>
                </div>

                <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700/30">
                  <h3 className="text-white font-medium mb-3">Color Blind Support</h3>
                  <select
                    value={appearanceSettings.colorBlindMode}
                    onChange={(e) => handleSelect('colorBlindMode', e.target.value)}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-green-400 focus:ring-2 focus:ring-green-400/20 outline-none transition-all"
                  >
                    <option value="none">None</option>
                    <option value="protanopia">Protanopia (Red-blind)</option>
                    <option value="deuteranopia">Deuteranopia (Green-blind)</option>
                    <option value="tritanopia">Tritanopia (Blue-blind)</option>
                  </select>
                </div>
              </div>
            </section>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gray-700 hover:bg-gray-600 text-white font-semibold transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="w-5 h-5" />
              Cancel Changes
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold transition-all duration-200 hover:shadow-xl hover:shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              {isLoading ? "Saving..." : "Save Appearance"}
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
