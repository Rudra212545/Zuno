import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { User, Mail, Globe, Save, X, Camera } from "lucide-react";
import { setUser } from "../store/slices/userSlice";
import { set } from "../store/slices/uiSlice";
import axios from "axios";
import ProfileNavigation from "../components/ProfileNavigation";
import toast, { Toaster } from 'react-hot-toast'; // ✅ Add this import

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get user data from Redux store
  const { user, token, loading } = useSelector((state) => state.user);
  const ui = useSelector((state) => state.ui);
  
  // Local form state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("online");
  const [isLoading, setIsLoading] = useState(false);
  const [originalData, setOriginalData] = useState({});
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  // Refs for navbar
  const notificationsRef = useRef(null);
  const profileMenuRef = useRef(null);

  // Mock data for navbar
  const notifications = [];
  const unreadNotifications = 0;

  // ✅ Click outside detection to close menus
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

  // ✅ Fetch user profile on component mount with token persistence
  useEffect(() => {
    const fetchUserProfile = async () => {
      const storedToken = localStorage.getItem('token');
      
      console.log("=== TOKEN DEBUG ===");
      console.log("Redux token:", token);
      console.log("Stored token exists:", storedToken ? "YES" : "NO");
      console.log("Current user:", user);
      
      if (!user && storedToken) {
        console.log("🔄 Fetching user profile with stored token...");
        
        try {
          const response = await axios.get(
            "http://localhost:3000/api/v1/users/avatar",
            {
              headers: {
                "Authorization": `Bearer ${storedToken}`,
                "Content-Type": "application/json",
              }
            }
          );
          
          console.log("📡 Profile API response:", response.data);
          
          if (response.data.success && response.data.user) {
            dispatch(setUser(response.data.user));
            console.log("✅ User profile loaded successfully!");
          } else {
            console.log("❌ API returned success: false");
          }
        } catch (error) {
          console.error("❌ Profile fetch error:", error);
          console.error("Error response:", error.response?.data);
          
          if (error.response?.status === 401) {
            localStorage.removeItem('token');
            navigate('/login');
          }
        }
      } else if (!storedToken) {
        console.log("❌ No token found in localStorage");
        navigate('/login');
      } else if (user) {
        console.log("✅ User already loaded in Redux");
      }
      
      setPageLoading(false);
    };
  
    fetchUserProfile();
  }, []);

  // Initialize form with Redux user data
  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setEmail(user.email || "");
      setStatus(user.status || "online");
      setOriginalData({
        username: user.username || "",
        email: user.email || "",
        status: user.status || "online"
      });
    }
  }, [user]);

  useEffect(() => {
    console.log("=== PROFILE PAGE DEBUG ===");
    console.log("Full user object:", user);
    console.log("Avatar object:", user?.avatar);
    console.log("Avatar URL:", user?.avatar?.url);
    console.log("Profile Image URL:", user?.profileImageUrl);
    console.log("Is avatar URL valid?", user?.avatar?.url ? "YES" : "NO");
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(setUser(null));
    dispatch(set({ key: "showProfileMenu", value: false }));
    navigate('/');
  };

  const handleSave = async () => {
    if (!token) {
      // ✅ Replace alert with error toast
      toast.error("No authentication token found");
      return;
    }

    console.log("=== PROFILE UPDATE DEBUG (AXIOS) ===");
    console.log("Token:", token ? "EXISTS" : "MISSING");
    console.log("Data:", { username, email, status });

    setIsLoading(true);
    
    // ✅ Show loading toast
    const loadingToast = toast.loading('Updating profile...');

    try {
      const updateData = { username, email, status };
      
      const response = await axios.put(
        "http://localhost:3000/api/v1/users/profile", 
        updateData,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        }
      );

      console.log("Axios response:", response.data);

      const updatedUser = response.data.user;
      
      dispatch(setUser(updatedUser));
      
      setOriginalData({
        username: updatedUser.username,
        email: updatedUser.email,
        status: updatedUser.status
      });
      
      // ✅ Replace alert with success toast
      toast.success("Profile updated successfully! 🎉", {
        id: loadingToast, // Replace the loading toast
      });
      
    } catch (error) {
      console.error("=== AXIOS ERROR DEBUG ===");
      console.error("Error object:", error);
      console.error("Response data:", error.response?.data);
      console.error("Response status:", error.response?.status);
      console.error("Request config:", error.config);
      
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          "Failed to update profile. Please try again.";
      
      // ✅ Replace alert with error toast
      toast.error(`Update failed: ${errorMessage}`, {
        id: loadingToast, // Replace the loading toast
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    if (!file.type.startsWith('image/')) {
      // ✅ Replace alert with error toast
      toast.error('Please select an image file');
      return;
    }
  
    setIsUploadingImage(true);
    
    // ✅ Show loading toast for image upload
    const uploadToast = toast.loading('Uploading image...');
    
    try {
      const formData = new FormData();
      formData.append('avatar', file);
  
      const response = await axios.post(
        "http://localhost:3000/api/v1/users/avatar",
        formData,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          }
        }
      );
  
      console.log("=== UPLOAD RESPONSE DEBUG ===");
      console.log("Response:", response.data);
      console.log("Avatar URL:", response.data.avatarUrl);
      console.log("User avatar URL:", response.data.user?.avatar?.url);
  
      if (response.data.success && response.data.user) {
        dispatch(setUser(response.data.user));
        console.log("✅ Redux updated with user:", response.data.user);
      }
      
      // ✅ Replace alert with success toast
      toast.success("Profile image updated successfully! 📸", {
        id: uploadToast,
      });
      
    } catch (error) {
      console.error("Upload error:", error);
      // ✅ Replace alert with error toast
      toast.error(error.response?.data?.message || "Failed to upload image", {
        id: uploadToast,
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleCancel = () => {
    setUsername(originalData.username);
    setEmail(originalData.email);
    setStatus(originalData.status);
    
    // ✅ Add informational toast
    toast('Changes canceled', {
      icon: '↩️',
    });
  };

  // Show loading screen until data is ready
  if (pageLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading profile...</div>
      </main>
    );
  }

  // Show error if no user after loading
  if (!user) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center">
        <div className="text-red-500 text-xl">Failed to load profile. Please refresh.</div>
      </main>
    );
  }

  return (
    <>
      {/* ✅ Add Toaster component for toast notifications */}
      <Toaster
        position="top-center"
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
            border: '1px solid #4B5563',
            fontSize: '14px',
            fontWeight: '500',
          },
          // Default options for specific types
          success: {
            duration: 3000,
            style: {
              background: '#059669',
              color: '#fff',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#059669',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: '#DC2626',
              color: '#fff',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#DC2626',
            },
          },
          loading: {
            style: {
              background: '#3B82F6',
              color: '#fff',
            },
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
        <div className="max-w-4xl mx-auto mb-8">
          <div className="text-center mb-2">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              Profile Settings
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-blue-500 mx-auto rounded-full"></div>
          </div>
          <p className="text-gray-400 text-center mt-6 text-lg">
            Manage your account information and preferences
          </p>
        </div>

        {/* Main Profile Card */}
        <section className="max-w-4xl mx-auto bg-gray-900/80 backdrop-blur-lg rounded-3xl border border-gray-700/50 shadow-2xl overflow-hidden">
          <div className="p-8 md:p-12">
            <div className="flex flex-col lg:flex-row gap-12">
              
              {/* Left Panel: Avatar & Info */}
              <div className="flex flex-col items-center lg:items-start lg:w-1/3">
                <div className="relative mb-8 group">
                  <img
                    src={user?.profileImageUrl || user?.avatar?.url || `https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2`}
                    alt="User avatar"
                    className="w-40 h-40 rounded-full ring-4 ring-green-400/30 ring-offset-4 ring-offset-gray-900 shadow-xl hover:scale-105 transition-all duration-300"
                    onLoad={() => console.log("✅ Image loaded successfully")}
                    onError={(e) => console.log("❌ Image failed to load:", e.target.src)}
                  />
                  
                  {/* Upload overlay */}
                  <label className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <div className="text-center text-white">
                      {isUploadingImage ? (
                        <div>Uploading...</div>
                      ) : (
                        <>
                          <Camera className="w-8 h-8 mx-auto mb-1" />
                          <span className="text-sm">Change Photo</span>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploadingImage}
                      className="hidden"
                    />
                  </label>
                  
                  {/* Status indicator */}
                  <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-4 border-gray-900 shadow-lg ${
                    status === 'online' ? 'bg-green-400' : 
                    status === 'away' ? 'bg-yellow-400' : 
                    status === 'busy' ? 'bg-red-400' : 
                    status === "offline" ? 'bg-white' : 'bg-gray-400'
                  }`}></div>
                </div>

                <div className="text-center lg:text-left">
                  <h2 className="text-white text-2xl md:text-3xl font-bold mb-2 capitalize">
                    {username.replace("_", " ")}
                  </h2>
                  <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
                    <div className={`w-3 h-3 rounded-full ${
                      status === 'online' ? 'bg-green-400' : 
                      status === 'away' ? 'bg-yellow-400' : 
                      status === 'busy' ? 'bg-red-400' : 'bg-gray-400'
                    }`}></div>
                    <span className={`text-gray-300 font-semibold capitalize`}>
                      {status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Panel: Profile Form */}
              <div className="flex-1">
                <div className="space-y-8">
                  <div className="space-y-6">
                    <div>
                      <label className="flex items-center gap-2 mb-4 text-gray-300 font-semibold">
                        <User className="w-5 h-5" />
                        Username
                      </label>
                      <input
                        type="text"
                        className="w-full p-4 rounded-2xl bg-gray-800/50 border border-gray-600 placeholder-gray-400 text-white focus:border-green-400 focus:ring-2 focus:ring-green-400/20 focus:bg-gray-800 outline-none transition-all duration-200"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={isLoading}
                        required
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 mb-4 text-gray-300 font-semibold">
                        <Mail className="w-5 h-5" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        className="w-full p-4 rounded-2xl bg-gray-800/50 border border-gray-600 placeholder-gray-400 text-white focus:border-green-400 focus:ring-2 focus:ring-green-400/20 focus:bg-gray-800 outline-none transition-all duration-200"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                        required
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 mb-4 text-gray-300 font-semibold">
                        <Globe className="w-5 h-5" />
                        Status
                      </label>
                      <select
                        className="w-full p-4 rounded-2xl bg-gray-800/50 border border-gray-600 text-white focus:border-green-400 focus:ring-2 focus:ring-green-400/20 focus:bg-gray-800 outline-none transition-all duration-200"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        disabled={isLoading}
                        required
                      >
                        <option value="online">🟢 Online</option>
                        <option value="away">🟡 Away</option>
                        <option value="busy">🔴 Busy</option>
                        <option value="invisible">⚫ Invisible</option>
                        <option value="offline">⚪ Offline</option>
                      </select>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-700/50">
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={isLoading}
                      className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-2xl bg-gray-700 hover:bg-gray-600 text-white font-semibold transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <X className="w-5 h-5" />
                      Cancel
                    </button>
                    <button
                      type="submit"
                      onClick={(e) => {
                        e.preventDefault();
                        handleSave();
                      }}
                      disabled={isLoading}
                      className="flex items-center justify-center gap-2 w-full sm:flex-1 px-8 py-4 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold transition-all duration-200 hover:shadow-xl hover:shadow-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save className="w-5 h-5" />
                      {isLoading ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
