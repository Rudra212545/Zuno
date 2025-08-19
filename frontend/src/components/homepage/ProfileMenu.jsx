import React from 'react';
import { User, Settings, Moon, HelpCircle, LogOut } from 'lucide-react';
import { FiCheckCircle, FiClock, FiMinusCircle, FiEyeOff, FiSlash } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const ProfileMenu = ({ user, onLogout }) => {
  const menuItems = [
    { icon: User, label: 'Profile', color: 'text-gray-300', path: '/profile' },
    { icon: Settings, label: 'Settings', color: 'text-gray-300', path: '/settings' },
    { icon: Moon, label: 'Appearance', color: 'text-gray-300', path: '/appearance' },
    { icon: HelpCircle, label: 'Help & Support', color: 'text-gray-300', path: '/help' },
  ];

  const statusDetails = {
    online: { icon: <FiCheckCircle className="text-green-400" /> },
    away: { icon: <FiClock className="text-yellow-400" /> },
    busy: { icon: <FiMinusCircle className="text-red-500" /> },
    invisible: { icon: <FiEyeOff className="text-gray-500" /> },
    offline: { icon: <FiSlash className="text-gray-400" /> },
  };

  const status = user?.status?.toLowerCase() || "offline";
  const { icon } = statusDetails[status] || statusDetails["offline"];

  const navigate = useNavigate();
  return (
    <div className="absolute right-0 top-12 w-64 md:w-72 bg-gradient-to-b from-slate-900/95 to-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-600/30 py-4 z-50">
      <div className="px-6 py-4 border-b border-gray-700/30 ">
        <div className="flex items-center space-x-4 ml-2">
          <img 
            src={user?.profileImageUrl || user?.avatar?.url || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2'}
            alt={user?.name || "Profile"}
            className="w-14 h-14 rounded-full ring-3 ring-green-400/50 ring-offset-2 ring-offset-gray-900"
          />
          <div>
            <p className="font-bold text-white text-lg mb-2">{user?.username || "Guest"}</p>
            <div className="text-sm text-white font-medium flex items-center space-x-2">
            <div className="text-lg">{icon}</div>
            <div>{status.charAt(0).toUpperCase() + status.slice(1)}</div>
          </div>

          </div>
        </div>
      </div>
      
      <div className="py-2">
        {menuItems.map((item) => (
          <button 
            key={item._id} 
            className={`w-full px-6 py-3 text-left ${item.color} hover:bg-gray-700/30 hover:text-white flex items-center transition-all duration-200 group`}
            onClick={() => navigate(item.path)}
          >
            <item.icon size={18} className="mr-4 group-hover:scale-110 transition-transform duration-200" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </div>
      
      <div className="border-t border-gray-700/30 pt-2">
        <button 
          onClick={onLogout}
          className="w-full px-6 py-3 text-left text-red-400 hover:bg-red-600/10 hover:text-red-300 flex items-center transition-all duration-200 group"
        >
          <LogOut size={18} className="mr-4 group-hover:scale-110 transition-transform duration-200" />
          <span className="font-medium">Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileMenu;
