import React from 'react';
import { Search, Inbox, X, Users } from 'lucide-react';
import ProfileMenu from './ProfileMenu';
import NotificationPanel from './NotificationPanel ';

const TopNavigation = ({
  user,  // user passed as prop
  isDirectMessagesSelected,
  selectedServer,
  showNotifications,
  setShowNotifications,
  showProfileMenu,
  setShowProfileMenu,
  showMobileMenu,
  setShowMobileMenu,
  showChannels,
  setShowChannels,
  notifications,
  unreadNotifications,
  notificationsRef,
  profileMenuRef,
  handleLogout
}) => {

  return (
    <div className="fixed top-0 left-0 right-0 h-14 bg-gradient-to-r from-slate-900/95 via-gray-900/95 to-slate-800/95 backdrop-blur-xl border-b border-gray-700/30 flex items-center justify-between px-4 md:px-6 z-50 shadow-xl">
      <div className="flex items-center space-x-4">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setShowMobileMenu(prev => !prev)}
          className="md:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-xl transition-all duration-200"
          aria-label="Toggle mobile menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="flex items-center space-x-3">
          {/* Icon */}
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl shadow-lg overflow-hidden border border-white/10">
            {isDirectMessagesSelected ? (
              <div className="w-full h-full bg-indigo-500 flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
            ) : selectedServer?.iconUrl ? (
              <img
                src={selectedServer.iconUrl}
                alt="Server Icon"
                className="w-8 h-8 md:w-10 md:h-10 rounded-xl shadow-lg"
              />
            ) : (
              <div className="w-full h-full bg-indigo-500 flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
            )}
          </div>

          {/* Label */}
          <div className="hidden sm:block">
            <h1 className="text-lg md:text-xl font-bold text-white tracking-tight">
              {isDirectMessagesSelected ? 'Friends' : selectedServer?.name || ''}
            </h1>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 md:space-x-4">
        {/* Mobile Channels Toggle */}
        <button
          onClick={() => setShowChannels(prev => !prev)}
          className="md:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-xl transition-all duration-200"
          aria-label="Toggle channels"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
          </svg>
        </button>

        {/* Notifications */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => setShowNotifications(prev => !prev)}
            className="relative p-2 md:p-2.5 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-xl transition-all duration-200 group"
            aria-label="Notifications"
          >
            <Inbox size={18} className="md:w-5 md:h-5 group-hover:scale-110 transition-transform duration-200" />
            {unreadNotifications > 0 && (
              <div className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center font-bold shadow-lg animate-pulse">
                {unreadNotifications > 9 ? '9+' : unreadNotifications}
              </div>
            )}
          </button>

          {showNotifications && (
            <NotificationPanel
              notifications={notifications}
              onClose={() => setShowNotifications(false)}
            />
          )}
        </div>

        <div className="relative" ref={profileMenuRef}>
          {user?.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt={user.name || "Profile"}
              className="w-8 h-8 md:w-9 md:h-9 rounded-full cursor-pointer ring-2 ring-green-400/50 ring-offset-2 ring-offset-gray-900 hover:ring-indigo-500/70 transition-all duration-300 hover:scale-110"
              onClick={() => setShowProfileMenu(prev => !prev)}
            />
          ) : (
            <div
              onClick={() => setShowProfileMenu(prev => !prev)}
              className="w-8 h-8 md:w-9 md:h-9 rounded-full cursor-pointer ring-2 ring-green-400/50 ring-offset-2 ring-offset-gray-900 hover:ring-indigo-500/70 flex items-center justify-center text-white font-bold text-lg md:text-xl uppercase bg-indigo-600 transition-all duration-300 hover:scale-110 select-none"
              aria-label="User placeholder"
              title={user?.username || "User"}
            >
              {user?.username ? user.username.charAt(0).toUpperCase() : "U"}
            </div>
          )}

          {showProfileMenu && <ProfileMenu user={user} onLogout={handleLogout} />}
        </div>
      </div>
    </div>
  );
};

export default TopNavigation;
