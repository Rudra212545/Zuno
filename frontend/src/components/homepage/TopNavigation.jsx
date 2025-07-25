import React from 'react';
import { Search, Inbox, X, Users } from 'lucide-react';
import ProfileMenu from './ProfileMenu';
import NotificationPanel from './NotificationPanel';

const TopNavigation = ({
  user,
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
    <div className="fixed top-0 left-0 right-0 h-14 bg-gray-950/95 backdrop-blur-sm border-b border-gray-700/60 flex items-center justify-between px-4 md:px-6 z-50">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-transparent to-purple-900/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)] animate-pulse"></div>
      </div>

      {/* Left: Mobile Menu */}
      <div className="flex items-center space-x-4 relative z-10">
        <button
          onClick={() => setShowMobileMenu(prev => !prev)}
          className="md:hidden p-2 text-gray-400 hover:text-blue-400 hover:bg-gray-800/80 rounded-lg transition duration-300 hover:shadow-md hover:shadow-blue-400/30 border border-transparent hover:border-gray-700 group active:scale-95 transform"
          aria-label="Toggle mobile menu"
        >
          <svg className={`w-6 h-6 transition-transform duration-300 ${showMobileMenu ? 'rotate-90' : 'group-hover:rotate-12'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Center: Server Info */}
      <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-3 z-10">
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl shadow-lg overflow-hidden border border-gray-700/60 backdrop-blur-sm bg-gray-800/40 hover:bg-gray-700/60 transition duration-300 hover:border-blue-400/60 hover:shadow-blue-400/25 group hover:animate-bounce transform hover:scale-110">
          {isDirectMessagesSelected ? (
            <div className="w-full h-full bg-gradient-to-br from-blue-500/80 to-indigo-600/80 flex items-center justify-center backdrop-blur-sm">
              <Users className="w-5 h-5 text-white group-hover:animate-spin transition duration-300" />
            </div>
          ) : selectedServer?.iconUrl ? (
            <div className="relative w-full h-full group">
              <img
                src={selectedServer.iconUrl}
                alt="Server Icon"
                className="w-full h-full object-cover transition duration-300 group-hover:scale-110 group-hover:rotate-3"
              />
              <div className="absolute inset-0 bg-gray-900/20 group-hover:bg-blue-900/30 transition duration-300"></div>
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-500/80 to-indigo-600/80 flex items-center justify-center backdrop-blur-sm">
              <Users className="w-5 h-5 text-white group-hover:animate-spin transition duration-300" />
            </div>
          )}
        </div>

        <div className="hidden sm:block">
          <h1 className="text-lg md:text-xl font-semibold text-gray-100 tracking-tight hover:text-blue-200 transition duration-300 transform hover:translate-x-1">
            {isDirectMessagesSelected ? 'Friends' : selectedServer?.name || ''}
          </h1>
        </div>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center space-x-2 md:space-x-4 relative z-10">
        {/* Channels Toggle */}
        <button
          onClick={() => setShowChannels(prev => !prev)}
          className="md:hidden p-2 text-gray-400 hover:text-blue-400 hover:bg-gray-800/80 rounded-lg transition duration-300 hover:shadow-md hover:shadow-blue-400/30 border border-transparent hover:border-gray-700 group active:scale-95 transform"
          aria-label="Toggle channels"
        >
          <svg className={`w-5 h-5 transition-transform duration-300 ${showChannels ? 'rotate-180' : 'group-hover:-rotate-12'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
          </svg>
        </button>

        {/* Notifications */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => setShowNotifications(prev => !prev)}
            className="relative p-2 md:p-2.5 text-gray-400 hover:text-blue-400 hover:bg-gray-800/80 rounded-lg transition duration-300 group hover:shadow-md hover:shadow-blue-400/30 border border-transparent hover:border-gray-700 active:scale-95 transform hover:scale-110"
            aria-label="Notifications"
          >
            <Inbox size={18} className={`md:w-5 md:h-5 transition duration-300 ${unreadNotifications > 0 ? 'animate-bounce text-blue-400' : ''}`} />
            {unreadNotifications > 0 && (
              <div className="absolute -top-1 -right-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center font-medium shadow-lg border border-red-400/50 animate-pulse">
                <span className="animate-bounce">
                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </span>
              </div>
            )}
          </button>
          {showNotifications && (
            <div className="animate-in fade-in zoom-in duration-200">
              <NotificationPanel
                notifications={notifications}
                onClose={() => setShowNotifications(false)}
              />
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative" ref={profileMenuRef}>
          {user?.profileImageUrl ? (
            <div className="relative group">
              <img
                src={user.profileImageUrl}
                alt={user.name || "Profile"}
                className="w-8 h-8 md:w-9 md:h-9 rounded-full cursor-pointer ring-1 ring-gray-500/70 hover:ring-blue-500 ring-offset-1 ring-offset-gray-950 transition duration-300 hover:scale-110 shadow-md animate-pulse hover:animate-none transform"
                onClick={() => setShowProfileMenu(prev => !prev)}
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-950 animate-ping"></div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-950"></div>
            </div>
          ) : (
            <div className="relative group">
              <div
                onClick={() => setShowProfileMenu(prev => !prev)}
                className="w-8 h-8 md:w-9 md:h-9 rounded-full cursor-pointer ring-1 ring-gray-500/70 hover:ring-blue-500 ring-offset-1 ring-offset-gray-950 flex items-center justify-center text-white font-medium text-lg md:text-xl uppercase bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 transition duration-300 hover:scale-110 select-none shadow-md animate-pulse hover:animate-none transform"
                aria-label="User placeholder"
                title={user?.username || "User"}
              >
                <span className="transition duration-300 group-hover:rotate-12">
                  {user?.username ? user.username.charAt(0).toUpperCase() : "U"}
                </span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-950 animate-ping"></div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-950"></div>
            </div>
          )}
          {showProfileMenu && (
            <div className="animate-in fade-in zoom-in duration-200">
              <ProfileMenu user={user} onLogout={handleLogout} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopNavigation;
