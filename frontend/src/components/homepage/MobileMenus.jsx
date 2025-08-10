import React from 'react';
import { Hash, Volume2, Plus, X } from 'lucide-react';

const MobileMenus = ({
  showMobileMenu,
  setShowMobileMenu,
  showChannels,
  setShowChannels,
  servers,
  currentChannel,
  setCurrentChannel,
  mobileMenuRef,
  user,
  selectedServer,
  channels 
}) => {
    // Separate text and voice channels from channels prop
    const textChannels = channels.filter(channel => channel.type === 'text');
    const voiceChannels = channels.filter(channel => channel.type === 'voice');
  return (
    <>
      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden" onClick={() => setShowMobileMenu(false)} />
      )}

      {/* Mobile Servers Menu */}
      <div className={`fixed left-0 top-14 bottom-0 w-72 bg-gradient-to-b from-slate-900 to-gray-900 transform transition-transform duration-300 z-50 md:hidden ${showMobileMenu ? 'translate-x-0' : '-translate-x-full'}`} ref={mobileMenuRef}>
        <div className="p-4">
          <h2 className="text-lg font-bold text-white mb-4">Servers</h2>
          
          {/* Direct Messages */}
          <div className="mb-4">
            <div className="flex items-center p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl mb-2">
              <span className="text-white font-bold text-lg mr-3">D</span>
              <span className="text-white font-medium">Direct Messages</span>
            </div>
          </div>
          
          {/* Server List */}
          <div className="space-y-2">
            {servers.map((server) => (
              <div key={server.id} className={`flex items-center p-3 rounded-xl cursor-pointer transition-all duration-200 ${server.active ? 'bg-gradient-to-r from-indigo-600/30 to-purple-600/30' : 'hover:bg-gray-700/30'}`}>
                <span className="text-xl mr-3">{server.icon}</span>
                <span className="text-white font-medium flex-1">{server.name}</span>
                {server.notifications > 0 && (
                  <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full px-2 py-1 font-bold">
                    {server.notifications > 9 ? '9+' : server.notifications}
                  </span>
                )}
              </div>
            ))}
          </div>
          
          {/* Add Server */}
          <div className="mt-4">
            <div className="flex items-center p-3 bg-gradient-to-r from-gray-700 to-gray-800 rounded-xl cursor-pointer hover:from-green-500 hover:to-emerald-600 transition-all duration-200">
              <Plus size={24} className="text-green-400 hover:text-white mr-3" />
              <span className="text-gray-300 hover:text-white font-medium">Add a Server</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Channels Overlay */}
      {showChannels && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden" onClick={() => setShowChannels(false)} />
      )}

      {/* Mobile Channels Menu */}
      <div className={`fixed right-0 top-14 bottom-0 w-72 bg-gradient-to-b from-slate-800 to-gray-800 transform transition-transform duration-300 z-50 md:hidden ${showChannels ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">Dev Team</h2>
            <button
              onClick={() => setShowChannels(false)}
              className="p-2 text-gray-400 hover:text-white rounded-lg"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Text Channels */}
          <div className="mb-6">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Text Channels</h3>
            <div className="space-y-1">
              {textChannels.map((channel) => (
                <div
                  key={channel.id}
                  onClick={() => {
                    setCurrentChannel(channel.name);
                    setShowChannels(false);
                  }}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                    currentChannel === channel.name 
                      ? 'bg-gradient-to-r from-indigo-600/30 to-purple-600/30 text-white' 
                      : 'text-gray-400 hover:bg-gray-700/30 hover:text-gray-200'
                  }`}
                >
                  <div className="flex items-center">
                    <Hash size={18} className="mr-3" />
                    <span className="text-sm font-semibold">{channel.name}</span>
                  </div>
                  {channel.unread && (
                    <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full px-2 py-1 font-bold">
                      {channel.unread}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Voice Channels */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Voice Channels</h3>
            <div className="space-y-1">
              {voiceChannels.map((channel) => (
                <div key={channel.id}>
                  <div className="flex items-center justify-between p-3 rounded-xl cursor-pointer text-gray-400 hover:bg-gray-700/30 hover:text-gray-200 transition-all duration-200">
                    <div className="flex items-center">
                      <Volume2 size={18} className="mr-3" />
                      <span className="text-sm font-semibold">{channel.name}</span>
                    </div>
                    {channel.users && channel.users.length > 0 && (
                      <span className="text-xs text-green-400 font-bold bg-green-400/10 px-2 py-1 rounded-lg">{channel.users.length}</span>
                    )}
                  </div>
                  {channel.users && channel.users.map((user) => (
                    <div key={user.id} className="ml-9 px-3 py-1.5 text-xs text-gray-500 flex items-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                      <span className="font-medium">{user}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenus;