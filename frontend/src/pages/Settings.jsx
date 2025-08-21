// pages/Settings.jsx
import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Volume2, 
  Video, 
  Save, 
  X,
  Eye,
  EyeOff,
  Smartphone,
  Monitor
} from "lucide-react";
import { setUser } from "../store/slices/userSlice";
import { set } from "../store/slices/uiSlice";
import axios from "axios";
import ProfileNavigation from "../components/ProfileNavigation";

export default function Settings() {
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

  // Settings state based on your User schema
  const [settings, setSettings] = useState({
    // Privacy Settings
    showEmail: false,
    showPhone: false,
    allowDirectMessages: 'friends',
    allowFriendRequests: true,
    showOnlineStatus: true,
    
    // Notification Settings
    desktop: true,
    mobile: true,
    email: false,
    sounds: true,
    mentions: true,
    directMessages: true,
    friendRequests: true,
    eventReminders: true,
    callNotifications: true,
    
    // Video/Voice Settings
    autoJoinVoice: false,
    pushToTalk: false,
    pushToTalkKey: 'Space',
    noiseSuppression: true,
    echoCancellation: true,
    autoGainControl: true,
    videoQuality: 'auto',
    
    // Language and Localization
    language: 'en',
    timezone: 'UTC',
    autoTranslate: false,
    preferredTranslationLanguage: 'en'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [originalSettings, setOriginalSettings] = useState({});

  // Load user settings on mount
  useEffect(() => {
    if (user) {
      const userSettings = {
        // Privacy Settings - ✅ Use ?? to preserve false values
        showEmail: user.privacySettings?.showEmail ?? false,
        showPhone: user.privacySettings?.showPhone ?? false,
        allowDirectMessages: user.privacySettings?.allowDirectMessages ?? 'friends',
        allowFriendRequests: user.privacySettings?.allowFriendRequests ?? true,
        showOnlineStatus: user.privacySettings?.showOnlineStatus ?? true,
        
        // Notification Settings - ✅ Use ?? to preserve false values
        desktop: user.notificationSettings?.desktop ?? true,
        mobile: user.notificationSettings?.mobile ?? true,
        email: user.notificationSettings?.email ?? false,
        sounds: user.notificationSettings?.sounds ?? true,
        mentions: user.notificationSettings?.mentions ?? true,
        directMessages: user.notificationSettings?.directMessages ?? true,
        friendRequests: user.notificationSettings?.friendRequests ?? true,
        eventReminders: user.notificationSettings?.eventReminders ?? true,
        callNotifications: user.notificationSettings?.callNotifications ?? true,
        
        // Video/Voice Settings - ✅ Use ?? to preserve false values
        autoJoinVoice: user.videoSettings?.autoJoinVoice ?? false,
        pushToTalk: user.videoSettings?.pushToTalk ?? false,
        pushToTalkKey: user.videoSettings?.pushToTalkKey ?? 'Space',
        noiseSuppression: user.videoSettings?.noiseSuppression ?? true,
        echoCancellation: user.videoSettings?.echoCancellation ?? true,
        autoGainControl: user.videoSettings?.autoGainControl ?? true,
        videoQuality: user.videoSettings?.videoQuality ?? 'auto',
        
        // Language Settings - ✅ Use ?? to preserve false values
        language: user.language ?? 'en',
        timezone: user.timezone ?? 'UTC',
        autoTranslate: user.autoTranslate ?? false,
        preferredTranslationLanguage: user.preferredTranslationLanguage ?? 'en'
      };
      
      setSettings(userSettings);
      setOriginalSettings(userSettings);
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
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelect = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    console.log("=== SAVE SETTINGS DEBUG ===");
    console.log("Settings being sent:", settings);
    
    if (!token) {
      toast.error("No authentication token found", {
        style: {
          background: '#ef4444',
          color: '#fff',
        },
      });
      return;
    }
  
    setIsLoading(true);
    
    // Show loading toast
    const loadingToast = toast.loading('Saving settings...', {
      style: {
        background: '#374151',
        color: '#fff',
      },
    });

    try {
      const response = await axios.put(
        "http://localhost:3000/api/v1/users/settings",
        settings,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        }
      );
      
      console.log("API Response:", response.data);
  
      if (response.data.success) {
        // ✅ Update Redux store
        dispatch(setUser(response.data.user));
        
        // ✅ UPDATE LOCAL SETTINGS STATE WITH ACTUAL SAVED VALUES
        const savedUser = response.data.user;
        const updatedSettings = {
          // Privacy Settings
          showEmail: savedUser.privacySettings?.showEmail ?? false,
          showPhone: savedUser.privacySettings?.showPhone ?? false,
          allowDirectMessages: savedUser.privacySettings?.allowDirectMessages ?? 'friends',
          allowFriendRequests: savedUser.privacySettings?.allowFriendRequests ?? true,
          showOnlineStatus: savedUser.privacySettings?.showOnlineStatus ?? true,
          
          // Notification Settings
          desktop: savedUser.notificationSettings?.desktop ?? true,
          mobile: savedUser.notificationSettings?.mobile ?? true,
          email: savedUser.notificationSettings?.email ?? false,
          sounds: savedUser.notificationSettings?.sounds ?? true,
          mentions: savedUser.notificationSettings?.mentions ?? true,
          directMessages: savedUser.notificationSettings?.directMessages ?? true,
          friendRequests: savedUser.notificationSettings?.friendRequests ?? true,
          eventReminders: savedUser.notificationSettings?.eventReminders ?? true,
          callNotifications: savedUser.notificationSettings?.callNotifications ?? true,
          
          // Video/Voice Settings
          autoJoinVoice: savedUser.videoSettings?.autoJoinVoice ?? false,
          pushToTalk: savedUser.videoSettings?.pushToTalk ?? false,
          pushToTalkKey: savedUser.videoSettings?.pushToTalkKey ?? 'Space',
          noiseSuppression: savedUser.videoSettings?.noiseSuppression ?? true,
          echoCancellation: savedUser.videoSettings?.echoCancellation ?? true,
          autoGainControl: savedUser.videoSettings?.autoGainControl ?? true,
          videoQuality: savedUser.videoSettings?.videoQuality ?? 'auto',
          
          // Language Settings
          language: savedUser.language ?? 'en',
          timezone: savedUser.timezone ?? 'UTC',
          autoTranslate: savedUser.autoTranslate ?? false,
          preferredTranslationLanguage: savedUser.preferredTranslationLanguage ?? 'en'
        };
        
        // ✅ Update both local settings and original settings
        setSettings(updatedSettings);
        setOriginalSettings(updatedSettings);
        
        console.log("✅ Settings saved successfully!");
        console.log("Updated settings:", updatedSettings);
        
        // Dismiss loading toast and show success
        toast.dismiss(loadingToast);
        toast.success('Settings saved successfully!', {
          duration: 4000,
          style: {
            background: '#10b981',
            color: '#fff',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#10b981',
          },
        });
      }
      
    } catch (error) {
      console.error("Settings save error:", error);
      
      // Dismiss loading toast and show error
      toast.dismiss(loadingToast);
      toast.error(error.response?.data?.message || "Failed to save settings", {
        duration: 4000,
        style: {
          background: '#ef4444',
          color: '#fff',
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setSettings(originalSettings);
    toast('Changes cancelled', {
      icon: '↩️',
      style: {
        background: '#6b7280',
        color: '#fff',
      },
    });
  };

  if (pageLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading settings...</div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center">
        <div className="text-red-500 text-xl">Please log in to access settings.</div>
      </main>
    );
  }

  return (
    <>
      {/* Toast Container */}
      <Toaster 
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Define default options
          className: '',
          duration: 4000,
          style: {
            background: '#374151',
            color: '#fff',
            borderRadius: '12px',
            border: '1px solid #4b5563',
            fontSize: '14px',
            fontWeight: '500',
          },
        }}
      />

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
              <SettingsIcon className="w-10 h-10 text-blue-400" />
              Settings
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto rounded-full"></div>
          </div>
          <p className="text-gray-400 text-center mt-6 text-lg">
            Customize your Zuno experience
          </p>
        </div>

        {/* Settings Content */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Privacy Settings */}
            <section className="bg-gray-900/80 backdrop-blur-lg rounded-3xl border border-gray-700/50 shadow-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-6 h-6 text-green-400" />
                <h2 className="text-2xl font-bold text-white">Privacy</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700/30">
                  <div>
                    <h3 className="text-white font-medium">Show Email</h3>
                    <p className="text-gray-400 text-sm">Allow others to see your email address</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={settings.showEmail}
                      onChange={() => handleToggle('showEmail')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700/30">
                  <div>
                    <h3 className="text-white font-medium">Show Online Status</h3>
                    <p className="text-gray-400 text-sm">Display when you're online to others</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={settings.showOnlineStatus}
                      onChange={() => handleToggle('showOnlineStatus')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                  </label>
                </div>

                <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700/30">
                  <h3 className="text-white font-medium mb-3">Direct Messages</h3>
                  <p className="text-gray-400 text-sm mb-3">Who can send you direct messages</p>
                  <select
                    value={settings.allowDirectMessages}
                    onChange={(e) => handleSelect('allowDirectMessages', e.target.value)}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-green-400 focus:ring-2 focus:ring-green-400/20 outline-none transition-all"
                  >
                    <option value="everyone">Everyone</option>
                    <option value="friends">Friends Only</option>
                    <option value="none">No One</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Notification Settings */}
            <section className="bg-gray-900/80 backdrop-blur-lg rounded-3xl border border-gray-700/50 shadow-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Bell className="w-6 h-6 text-yellow-400" />
                <h2 className="text-2xl font-bold text-white">Notifications</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700/30">
                  <div className="flex items-center gap-3">
                    <Monitor className="w-5 h-5 text-blue-400" />
                    <div>
                      <h3 className="text-white font-medium">Desktop Notifications</h3>
                      <p className="text-gray-400 text-sm">Show notifications on desktop</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={settings.desktop}
                      onChange={() => handleToggle('desktop')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700/30">
                  <div className="flex items-center gap-3">
                    <Volume2 className="w-5 h-5 text-purple-400" />
                    <div>
                      <h3 className="text-white font-medium">Sound Notifications</h3>
                      <p className="text-gray-400 text-sm">Play sounds for notifications</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={settings.sounds}
                      onChange={() => handleToggle('sounds')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700/30">
                  <div>
                    <h3 className="text-white font-medium">Mentions</h3>
                    <p className="text-gray-400 text-sm">Notify when someone mentions you</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={settings.mentions}
                      onChange={() => handleToggle('mentions')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                  </label>
                </div>
              </div>
            </section>

            {/* Voice & Video Settings */}
            <section className="bg-gray-900/80 backdrop-blur-lg rounded-3xl border border-gray-700/50 shadow-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Video className="w-6 h-6 text-red-400" />
                <h2 className="text-2xl font-bold text-white">Voice & Video</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700/30">
                  <div>
                    <h3 className="text-white font-medium">Auto Join Voice</h3>
                    <p className="text-gray-400 text-sm">Automatically join voice channels</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={settings.autoJoinVoice}
                      onChange={() => handleToggle('autoJoinVoice')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                  </label>
                </div>

                <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700/30">
                  <h3 className="text-white font-medium mb-3">Video Quality</h3>
                  <select
                    value={settings.videoQuality}
                    onChange={(e) => handleSelect('videoQuality', e.target.value)}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-green-400 focus:ring-2 focus:ring-green-400/20 outline-none transition-all"
                  >
                    <option value="auto">Auto</option>
                    <option value="low">Low (480p)</option>
                    <option value="medium">Medium (720p)</option>
                    <option value="high">High (1080p)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700/30">
                  <div>
                    <h3 className="text-white font-medium">Noise Suppression</h3>
                    <p className="text-gray-400 text-sm">Reduce background noise</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={settings.noiseSuppression}
                      onChange={() => handleToggle('noiseSuppression')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                  </label>
                </div>
              </div>
            </section>

            {/* Language & Region */}
            <section className="bg-gray-900/80 backdrop-blur-lg rounded-3xl border border-gray-700/50 shadow-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Globe className="w-6 h-6 text-indigo-400" />
                <h2 className="text-2xl font-bold text-white">Language & Region</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-300 font-medium mb-3">Language</label>
                  <select
                    value={settings.language}
                    onChange={(e) => handleSelect('language', e.target.value)}
                    className="w-full p-4 bg-gray-700 border border-gray-600 rounded-xl text-white focus:border-green-400 focus:ring-2 focus:ring-green-400/20 outline-none transition-all"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="it">Italian</option>
                    <option value="pt">Portuguese</option>
                    <option value="ru">Russian</option>
                    <option value="ja">Japanese</option>
                    <option value="ko">Korean</option>
                    <option value="zh">Chinese</option>
                    <option value="ar">Arabic</option>
                    <option value="hi">Hindi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 font-medium mb-3">Timezone</label>
                  <select
                    value={settings.timezone}
                    onChange={(e) => handleSelect('timezone', e.target.value)}
                    className="w-full p-4 bg-gray-700 border border-gray-600 rounded-xl text-white focus:border-green-400 focus:ring-2 focus:ring-green-400/20 outline-none transition-all"
                  >
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Denver">Mountain Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                    <option value="Europe/London">London</option>
                    <option value="Europe/Berlin">Berlin</option>
                    <option value="Asia/Tokyo">Tokyo</option>
                    <option value="Asia/Shanghai">Shanghai</option>
                    <option value="Asia/Mumbai">Mumbai</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700/30">
                  <div>
                    <h3 className="text-white font-medium">Auto Translate</h3>
                    <p className="text-gray-400 text-sm">Automatically translate messages</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={settings.autoTranslate}
                      onChange={() => handleToggle('autoTranslate')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                  </label>
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
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              {isLoading ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </div>
      </main>
    </>
  );
}