import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { User, Mail, Globe, Save, X } from "lucide-react";
import { setUser } from "../store/slices/userSlice";
import axios from "axios";

export default function Profile() {
  const dispatch = useDispatch();
  
  // Get user data from Redux store
  const { user, token, loading } = useSelector((state) => state.user);
  
  // Local form state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("online");
  const [isLoading, setIsLoading] = useState(false);
  const [originalData, setOriginalData] = useState({});

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

  const handleSave = async () => {
    if (!token) {
      alert("No authentication token found");
      return;
    }
    console.log("=== PROFILE UPDATE DEBUG (AXIOS) ===");
    console.log("Token:", token ? "EXISTS" : "MISSING");
    console.log("Data:", { username, email, status });


    setIsLoading(true);
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

      // Axios automatically handles JSON parsing
      const updatedUser = response.data.user;
      
      // Update Redux store with new user data
      dispatch(setUser(updatedUser));
      
      // Update original data for cancel functionality
      setOriginalData({
        username: updatedUser.username,
        email: updatedUser.email,
        status: updatedUser.status
      });
      
      alert("Profile updated successfully!");
      
    } catch (error) {
      console.error("=== AXIOS ERROR DEBUG ===");
      console.error("Error object:", error);
      console.error("Response data:", error.response?.data);
      console.error("Response status:", error.response?.status);
      console.error("Request config:", error.config);
      
      // Axios provides better error handling
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          "Failed to update profile. Please try again.";
      
      alert(`Update failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset to original Redux values
    setUsername(originalData.username);
    setEmail(originalData.email);
    setStatus(originalData.status);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "online": return "text-green-400";
      case "away": return "text-yellow-400";
      case "busy": return "text-red-400";
      case "invisible": return "text-gray-400";
      case "offline": return "text-gray-500";
      default: return "text-gray-400";
    }
  };

  // Show loading state if user data isn't available yet
  if (!user && !loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading profile...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 py-12 px-6">
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
              <div className="relative mb-8">
                <img
                  src={user?.profileImageUrl || `https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2`}
                  alt="User avatar"
                  className="w-40 h-40 rounded-full ring-4 ring-green-400/30 ring-offset-4 ring-offset-gray-900 shadow-xl hover:scale-105 transition-all duration-300"
                />
                <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-4 border-gray-900 shadow-lg ${
                  status === 'online' ? 'bg-green-400' : 
                  status === 'away' ? 'bg-yellow-400' : 
                  status === 'busy' ? 'bg-red-400' : 'bg-gray-400'
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
                  <span className={`${getStatusColor(status)} font-semibold capitalize`}>
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
  );
}
