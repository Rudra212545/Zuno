import React from 'react';
import { Hash, Volume2, Plus, MoreVertical, Mic, Headphones, Settings } from 'lucide-react';

const ChannelsSidebar = ({ 
  currentChannel, 
  setCurrentChannel, 
  textChannels, 
  voiceChannels 
}) => {
  return (
    <div className="hidden md:flex w-72 bg-gradient-to-b from-slate-800 to-gray-800 flex-col border-r border-gray-700/30 mt-14 shadow-xl">
      {/* Server Header */}
      <div className="h-16 px-6 flex items-center justify-between border-b border-gray-600/30 bg-gradient-to-r from-slate-800/80 to-gray-800/80 backdrop-blur-sm shadow-lg">
        <h1 className="font-bold text-white text-xl tracking-tight">Dev Team</h1>
        <MoreVertical size={20} className="text-gray-400 cursor-pointer hover:text-white transition-all duration-200 hover:rotate-90" />
      </div>
      
      {/* Channels List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
        {/* Text Channels */}
        <div className="pt-6">
          <div className="px-4 mb-3 flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Text Channels</span>
            <Plus size={16} className="text-gray-400 cursor-pointer hover:text-white transition-all duration-200 hover:rotate-90" />
          </div>
          {textChannels.map((channel) => (
            <div
              key={channel.id}
              onClick={() => setCurrentChannel(channel.name)}
              className={`mx-3 px-3 py-2.5 rounded-xl flex items-center justify-between cursor-pointer group transition-all duration-200 ${
                currentChannel === channel.name 
                  ? 'bg-gradient-to-r from-indigo-600/30 to-purple-600/30 text-white border-l-4 border-indigo-500 shadow-lg' 
                  : 'text-gray-400 hover:bg-gray-700/30 hover:text-gray-200'
              }`}
            >
              <div className="flex items-center">
                <Hash size={18} className="mr-3 opacity-70 group-hover:opacity-100 transition-opacity duration-200" />
                <span className="text-sm font-semibold">{channel.name}</span>
              </div>
              {channel.unread && (
                <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center font-bold shadow-lg animate-pulse">
                  {channel.unread}
                </span>
              )}
            </div>
          ))}
        </div>
        
        {/* Voice Channels */}
        <div className="pt-6">
          <div className="px-4 mb-3 flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Voice Channels</span>
            <Plus size={16} className="text-gray-400 cursor-pointer hover:text-white transition-all duration-200 hover:rotate-90" />
          </div>
          {voiceChannels.map((channel) => (
            <div key={channel.id} className="mx-3">
              <div className="px-3 py-2.5 rounded-xl flex items-center cursor-pointer text-gray-400 hover:bg-gray-700/30 hover:text-gray-200 transition-all duration-200 group">
                <Volume2 size={18} className="mr-3 opacity-70 group-hover:opacity-100 transition-opacity duration-200" />
                <span className="text-sm font-semibold flex-1">{channel.name}</span>
                {channel.users && channel.users.length > 0 && (
                  <span className="text-xs text-green-400 font-bold bg-green-400/10 px-2 py-1 rounded-lg">{channel.users.length}</span>
                )}
              </div>
              {channel.users && channel.users.map((user, index) => (
                <div key={index} className="ml-9 px-3 py-1.5 text-xs text-gray-500 flex items-center hover:text-gray-400 transition-colors duration-200">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                  <span className="font-medium">{user}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      
      {/* User Area */}
      <div className="h-20 bg-gradient-to-r from-slate-900/80 to-gray-900/80 backdrop-blur-sm px-4 flex items-center border-t border-gray-700/30 shadow-lg gap-9">
        <div className="flex items-center flex-1">
          <img 
            src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2" 
            alt="User" 
            className="w-10 h-10 rounded-full mr-3 ring-2 ring-green-400/50 ring-offset-2 ring-offset-gray-800"
          />
          <div className="flex-1">
            <p className="text-sm font-bold text-white">YourUsername</p>
            <p className="text-xs text-green-400 font-medium flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              Online
            </p>
          </div>
        </div>
        <div className="flex ">
          {[
            { icon: Mic, color: 'text-gray-400 hover:text-white' },
            { icon: Headphones, color: 'text-gray-400 hover:text-white' },
            { icon: Settings, color: 'text-gray-400 hover:text-white' }
          ].map((item, index) => (
            <button key={index} className={`p-2.5 ${item.color} hover:bg-gray-700/50 rounded-xl transition-all duration-200 hover:scale-110`}>
              <item.icon size={18} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChannelsSidebar;