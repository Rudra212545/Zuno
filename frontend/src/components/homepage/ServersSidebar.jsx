import React from 'react';
import { Plus, Sparkles } from 'lucide-react';

const ServersSidebar = ({ servers, onOpenAddServer,onSelectServer, onSelectDirectMessages }) => {
  // console.log("Servers data:", servers);
  return (
    <div className="hidden md:flex w-20 bg-gradient-to-b from-[#0f0f1c] via-[#1c1c2e] to-[#2e2e3e] flex-col items-center py-6 space-y-3 border-r border-white/10 mt-14 shadow-2xl overflow-y-auto overflow-x-hidden relative z-50">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-r from-blue-500/15 to-indigo-500/15 rounded-full blur-2xl animate-pulse delay-1000"></div>
        
        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 bg-white/30 rounded-full animate-float"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          ></div>
        ))}
        
        {/* Animated lines */}
        <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent animate-pulse"></div>
        <div className="absolute bottom-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/15 to-transparent animate-pulse delay-1500"></div>
      </div>

      {/* Home/Direct Messages */}
      <div className="relative group z-10"
      onClick={() => {
        console.log('Direct Message clicked');
        if (onSelectDirectMessages) {
          console.log('Function exists — calling now.');
          onSelectDirectMessages();
        } else {
          console.log('Function does NOT exist.');
        }
      }}
      >
        {/* Glow effect behind icon */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/30 via-purple-600/30 to-pink-500/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-110"></div>
        
        <div className="relative w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-300 hover:rounded-xl hover:shadow-2xl hover:shadow-indigo-500/50 hover:scale-110 group-hover:rotate-3 border border-white/20 group-hover:border-white/40 overflow-hidden">
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
          
          <span className="relative z-10 text-white font-bold text-xl drop-shadow-lg group-hover:animate-pulse">D</span>
          
          {/* Floating sparkles */}
          <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Sparkles className="w-3 h-3 text-yellow-300 animate-pulse" />
          </div>
        </div>
        
        {/* Active indicator */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-gradient-to-b from-white via-indigo-300 to-white rounded-r-full transition-all duration-300 group-hover:h-8 shadow-lg"></div>
        
        {/* Enhanced tooltip - positioned to the right */}
        <div className="fixed left-20 bg-gradient-to-br from-black/95 to-gray-900/95 backdrop-blur-xl text-white px-4 py-3 rounded-xl text-sm font-medium opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-[9999] border border-white/20 shadow-2xl"
             style={{ top: `${14 + 24 + 32}px` }}>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full animate-pulse"></div>
            <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent font-semibold"> Direct Messages</span>
          </div>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-0 h-0 border-r-8 border-r-black/95 border-t-4 border-b-4 border-t-transparent border-b-transparent"></div>
        </div>
      </div>
      
      {/* Enhanced divider */}
      <div className="w-10 h-0.5 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent rounded-full relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full animate-pulse"></div>
      </div>
      
      {/* Server Icons */}
      {servers.map((server, index) => (
       <div
       key={server.id}
       className="relative group z-10"
       onClick={() => onSelectServer(server)}
     >
          {/* Glow effect behind server icon */}
          <div className={`absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-110 ${
            server.active 
              ? 'bg-gradient-to-r from-indigo-500/40 via-purple-600/40 to-pink-500/40' 
              : 'bg-gradient-to-r from-gray-500/30 via-indigo-500/30 to-purple-500/30'
          }`}></div>
          
          <div className={`relative w-14 h-14 ${
            server.active 
              ? 'bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-2xl shadow-indigo-500/50 border-2 border-white/30' 
              : 'bg-gradient-to-br from-gray-700/80 to-gray-800/80 rounded-2xl hover:rounded-xl hover:bg-gradient-to-br hover:from-indigo-500 hover:to-purple-600 hover:shadow-2xl hover:shadow-indigo-500/50 border border-white/10 hover:border-white/30'
          } flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 group-hover:rotate-3 backdrop-blur-sm overflow-hidden`}>
            
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
            
            {/* Enhanced image container */}
            <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 group-hover:border-white/40 transition-all duration-300">
              <img
                src={server.iconUrl}
                alt={`${server.name} icon`}
                className="w-full h-full object-cover object-center transition-all duration-300 group-hover:scale-110"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/40/6366F1/FFFFFF?text=' + server.name.charAt(0);
                  console.error('Image failed to load:', server.icon);
                }}
              />
              
              {/* Image overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            {/* Floating sparkles */}
            <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-pulse"></div>
            </div>
          </div>
          
          {/* Enhanced notification badge */}
          {server.notifications > 0 && (
            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-xl animate-bounce border-2 border-white/20 z-20">
              <span className="drop-shadow-sm">{server.notifications > 9 ? '9+' : server.notifications}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-400/50 to-red-500/50 rounded-full animate-ping"></div>
            </div>
          )}
          
          {/* Enhanced active indicator */}
          {server.active && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 bg-gradient-to-b from-white via-indigo-300 to-white rounded-r-full shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-b from-white/80 to-indigo-300/80 rounded-r-full animate-pulse"></div>
            </div>
          )}
          
          {/* Enhanced tooltip - positioned to the right */}
          <div className="fixed left-20 bg-gradient-to-br from-black/95 to-gray-900/95 backdrop-blur-xl text-white px-4 py-3 rounded-xl text-sm font-medium opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-[9999] border border-white/20 shadow-2xl max-w-xs"
               style={{ top: `${14 + 24 + 56 + 12 + 72 * (index + 1) - 12}px` }}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full animate-pulse"></div>
              <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent font-semibold truncate">
                {server.name}
              </span>
            </div>
            {server.notifications > 0 && (
              <div className="mt-1 text-xs text-gray-300 flex items-center gap-1">
                <div className="w-1 h-1 bg-red-400 rounded-full animate-pulse"></div>
                {server.notifications} new message{server.notifications > 1 ? 's' : ''}
              </div>
            )}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-0 h-0 border-r-8 border-r-black/95 border-t-4 border-b-4 border-t-transparent border-b-transparent"></div>
          </div>
        </div>
      ))}
      
      {/* Enhanced Add Server */}
      <div className="relative group z-10">
        {/* Glow effect behind add server */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/30 via-emerald-600/30 to-teal-500/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-110"></div>
        
        <div onClick={onOpenAddServer} className="relative w-14 h-14 bg-gradient-to-br from-gray-700/80 to-gray-800/80 rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-300 hover:rounded-xl hover:bg-gradient-to-br hover:from-green-500 hover:to-emerald-600 text-green-400 hover:text-white hover:scale-110 hover:shadow-2xl hover:shadow-green-500/50 group-hover:rotate-3 border border-white/10 hover:border-white/30 backdrop-blur-sm overflow-hidden">
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
          
          <Plus size={28} className="relative z-10 group-hover:rotate-90 transition-transform duration-300 drop-shadow-lg" />
          
          {/* Floating sparkles */}
          <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Sparkles className="w-3 h-3 text-yellow-300 animate-pulse" />
          </div>
          
          {/* Pulsing ring on hover */}
          <div className="absolute inset-0 border-2 border-green-400/0 group-hover:border-green-400/50 rounded-2xl group-hover:rounded-xl transition-all duration-300 animate-pulse"></div>
        </div>
        
       {/* Enhanced tooltip - fixed, positioned dynamically to the right with arrow */}
        <div
          className="fixed left-20 bg-gradient-to-br from-black/95 to-gray-900/95 backdrop-blur-xl text-white px-4 py-3 rounded-xl text-sm font-medium opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-[9999] border border-white/20 shadow-2xl"
          style={{
            // Adjust the top value to position the tooltip correctly next to the Add Server button
            top: 'calc(14px + 24px + 56px + 12px + 72px * ' + (servers.length + 1) + ' - 12px)'
          }}
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
            <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent font-semibold">
              Add a Server
            </span>
          </div>
          <div className="mt-1 text-xs text-gray-300">Create or join a community</div>

          {/* Left-pointing arrow */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-0 h-0 border-r-8 border-r-black/95 border-t-4 border-b-4 border-t-transparent border-b-transparent"></div>
        </div>

        
      </div>
    </div>
  );
};

export default ServersSidebar;