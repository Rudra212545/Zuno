import {React, useState} from 'react';
import { createPortal } from "react-dom";
import { Plus, Sparkles } from 'lucide-react';

const ServersSidebar = ({ servers, onOpenAddServer,onSelectServer, onSelectDirectMessages }) => {
  const [showDmTooltip, setShowDmTooltip] = useState(false);
  // console.log("Servers data:", servers);
  return (
    <div className="hidden md:flex w-20 bg-gradient-to-b from-slate-950 via-gray-950 to-black flex-col items-center py-6 space-y-3 border-r border-white/15 mt-14 shadow-2xl overflow-y-auto overflow-x-hidden relative">
      {/* Enhanced animated background elements with more depth */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Primary gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/30 via-purple-950/20 to-slate-950/40"></div>
        
        {/* Multiple gradient orbs with staggered animations */}
        <div className="absolute top-1/6 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-gradient-to-r from-indigo-500/15 via-purple-500/15 to-pink-500/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-2/5 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-indigo-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 w-14 h-14 bg-gradient-to-r from-purple-500/12 via-pink-500/12 to-rose-500/12 rounded-full blur-2xl animate-pulse delay-2000"></div>
        
        {/* Enhanced floating particles with varied sizes */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`absolute ${i % 3 === 0 ? 'w-1 h-1' : i % 3 === 1 ? 'w-0.5 h-0.5' : 'w-0.5 h-px'} bg-gradient-to-r from-white/40 to-indigo-300/40 rounded-full animate-float`}
            style={{
              left: `${15 + Math.random() * 70}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${4 + Math.random() * 6}s`
            }}
          ></div>
        ))}
        
        {/* Animated gradient lines with better spacing */}
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent animate-pulse"></div>
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/25 to-transparent animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-500/20 to-transparent animate-pulse delay-2000"></div>
        
        {/* Subtle edge lighting */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      </div>

      {/* Home/Direct Messages */}
      <div
        className="relative group z-10"
        onClick={() => {
          console.log('Direct Message clicked');
          if (onSelectDirectMessages) {
            console.log('Function exists — calling now.');
            onSelectDirectMessages();
          } else {
            console.log('Function does NOT exist.');
          }
        }}
        onMouseEnter={() => setShowDmTooltip(true)}
        onMouseLeave={() => setShowDmTooltip(false)}
      >
        {/* Enhanced multi-layer glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-purple-600/0 to-pink-500/0 group-hover:from-indigo-500/40 group-hover:via-purple-600/40 group-hover:to-pink-500/40 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 scale-125"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/0 via-purple-500/0 to-pink-400/0 group-hover:from-indigo-400/20 group-hover:via-purple-500/20 group-hover:to-pink-400/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 scale-110"></div>
        
        <div className="relative w-14 h-14 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-500 hover:rounded-xl hover:shadow-2xl hover:shadow-indigo-500/60 hover:scale-110 group-hover:rotate-3 border-2 border-white/30 group-hover:border-white/50 overflow-hidden backdrop-blur-sm">
          {/* Enhanced shine effect with multiple layers */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-250%] transition-transform duration-1200 ease-out"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <span className="relative z-10 text-white font-bold text-xl drop-shadow-xl group-hover:animate-pulse bg-gradient-to-r from-white via-indigo-100 to-purple-100 bg-clip-text text-transparent group-hover:from-white group-hover:via-white group-hover:to-white">D</span>
          
          {/* Enhanced floating sparkles with staggered animations */}
          <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200">
            <Sparkles className="w-3 h-3 text-yellow-300 animate-pulse" />
          </div>
          <div className="absolute -bottom-1 -left-1 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-400">
            <div className="w-1.5 h-1.5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-pulse"></div>
          </div>
        </div>
        
        {/* Enhanced active indicator with gradient animation */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-gradient-to-b from-white via-indigo-300 to-white rounded-r-full transition-all duration-500 group-hover:h-10 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 to-indigo-200/90 rounded-r-full animate-pulse"></div>
        </div>
        
        {/* Enhanced tooltip with improved positioning and styling */}
        {showDmTooltip && createPortal(
  <div
    className="fixed bg-gradient-to-br from-black/98 via-gray-900/98 to-slate-900/98 backdrop-blur-2xl text-white px-5 py-4 rounded-2xl text-sm font-medium opacity-100 pointer-events-auto transition-all duration-500 whitespace-nowrap border border-white/30 shadow-2xl z-[999999]"
    style={{
      left: '80px',  // Adjust these values for proper positioning!
      top: `${14 + 24 + 32}px`,  // Match your prior positioning logic
    }}
  >
    <div className="flex items-center gap-3">
      <div className="w-2.5 h-2.5 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full animate-pulse shadow-lg"></div>
      <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-bold text-base">
        Direct Messages
      </span>
    </div>
    <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 w-0 h-0 border-r-12 border-r-black/98 border-t-6 border-b-6 border-t-transparent border-b-transparent drop-shadow-lg"></div>
    <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-50"></div>
  </div>,
  document.body
)}

      </div>
      
      {/* Enhanced divider with animated gradient */}
      <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-purple-500/60 to-transparent rounded-full relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-purple-400/60 to-purple-400/0 rounded-full animate-pulse delay-500"></div>
      </div>
      
      {/* Server Icons */}
      {servers.map((server, index) => (
       <div
       key={server._id || server.id} 
       className="relative group z-10"
       onClick={() => onSelectServer(server)}
     >
          {/* Enhanced multi-layer glow effect for servers */}
          <div className={`absolute inset-0 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 scale-125 ${
            server.active 
              ? 'bg-gradient-to-r from-indigo-500/50 via-purple-600/50 to-pink-500/50' 
              : 'bg-gradient-to-r from-gray-500/30 via-indigo-500/40 to-purple-500/40'
          }`}></div>
          <div className={`absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 scale-110 ${
            server.active 
              ? 'bg-gradient-to-r from-indigo-400/30 via-purple-500/30 to-pink-400/30' 
              : 'bg-gradient-to-r from-gray-400/20 via-indigo-400/30 to-purple-400/30'
          }`}></div>
          
          <div className={`relative w-14 h-14 ${
            server.active 
              ? 'bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 rounded-xl shadow-2xl shadow-indigo-500/60 border-2 border-white/40 ring-2 ring-indigo-400/50' 
              : 'bg-gradient-to-br from-gray-800/90 via-gray-700/90 to-gray-800/90 rounded-2xl hover:rounded-xl hover:bg-gradient-to-br hover:from-indigo-500 hover:via-purple-600 hover:to-pink-600 hover:shadow-2xl hover:shadow-indigo-500/60 border-2 border-white/15 hover:border-white/40'
          } flex items-center justify-center cursor-pointer transition-all duration-500 hover:scale-110 group-hover:rotate-3 backdrop-blur-sm overflow-hidden`}>
            
            {/* Enhanced shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-250%] transition-transform duration-1200 ease-out"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Enhanced image container with better styling */}
            <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-white/15 backdrop-blur-sm border-2 border-white/25 group-hover:border-white/50 transition-all duration-500 shadow-lg">
              <img
                src={server.iconUrl}
                alt={`${server.name} icon`}
                className="w-full h-full object-cover object-center transition-all duration-500 group-hover:scale-110"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/40/6366F1/FFFFFF?text=' + server.name.charAt(0);
                  console.error('Image failed to load:', server.icon);
                }}
              />
              
              {/* Enhanced image overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-transparent to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            {/* Enhanced floating elements */}
            <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200">
              <div className="w-2.5 h-2.5 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-full animate-pulse shadow-lg"></div>
            </div>
            <div className="absolute -bottom-1 -left-1 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-400">
              <div className="w-1.5 h-1.5 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full animate-pulse"></div>
            </div>
          </div>
          
          {/* Enhanced notification badge with better animations */}
          {server.notifications > 0 && (
            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 via-red-600 to-rose-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-2xl animate-bounce border-2 border-white/30 z-20 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-red-400/50 to-rose-500/50 rounded-full animate-ping"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent rounded-full"></div>
              <span className="relative z-10 drop-shadow-lg">{server.notifications > 9 ? '9+' : server.notifications}</span>
            </div>
          )}
          
          {/* Enhanced active indicator with better gradient */}
          {server.active && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-gradient-to-b from-white via-indigo-300 to-white rounded-r-full shadow-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-indigo-200/90 to-white/90 rounded-r-full animate-pulse"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-400/50 via-purple-400/50 to-pink-400/50 rounded-r-full animate-pulse delay-500"></div>
            </div>
          )}
          
          {/* Enhanced tooltip with improved design */}
          <div className="fixed left-20 bg-gradient-to-br from-black/98 via-gray-900/98 to-slate-900/98 backdrop-blur-2xl text-white px-5 py-4 rounded-2xl text-sm font-medium opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-500 whitespace-nowrap border border-white/30 shadow-2xl max-w-xs"
               style={{ 
                 top: `${14 + 24 + 56 + 12 + 72 * (index + 1) - 12}px`,
                 zIndex: 99999999
               }}>
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full animate-pulse shadow-lg"></div>
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-bold text-base truncate">
                {server.name}
              </span>
            </div>
            {server.notifications > 0 && (
              <div className="mt-2 text-xs text-gray-300 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-gradient-to-r from-red-400 to-rose-400 rounded-full animate-pulse shadow-sm"></div>
                <span className="font-medium">{server.notifications} new message{server.notifications > 1 ? 's' : ''}</span>
              </div>
            )}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 w-0 h-0 border-r-12 border-r-black/98 border-t-6 border-b-6 border-t-transparent border-b-transparent drop-shadow-lg"></div>
            {/* Additional glow around tooltip */}
            <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-50"></div>
          </div>
        </div>
      ))}
      
      {/* Enhanced Add Server with improved styling */}
      <div className="relative group z-10">
        {/* Enhanced multi-layer glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-emerald-600/0 to-teal-500/0 group-hover:from-green-500/40 group-hover:via-emerald-600/40 group-hover:to-teal-500/40 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 scale-125"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-emerald-500/0 to-teal-400/0 group-hover:from-green-400/20 group-hover:via-emerald-500/20 group-hover:to-teal-400/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 scale-110"></div>
        
        <div onClick={onOpenAddServer} className="relative w-14 h-14 bg-gradient-to-br from-gray-800/90 via-gray-700/90 to-gray-800/90 rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-500 hover:rounded-xl hover:bg-gradient-to-br hover:from-green-500 hover:via-emerald-600 hover:to-teal-600 text-green-400 hover:text-white hover:scale-110 hover:shadow-2xl hover:shadow-green-500/60 group-hover:rotate-3 border-2 border-white/15 hover:border-white/40 backdrop-blur-sm overflow-hidden">
          {/* Enhanced shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-250%] transition-transform duration-1200 ease-out"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <Plus size={28} className="relative z-10 group-hover:rotate-90 transition-transform duration-500 drop-shadow-xl group-hover:drop-shadow-2xl" />
          
          {/* Enhanced floating sparkles */}
          <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200">
            <Sparkles className="w-3 h-3 text-yellow-300 animate-pulse" />
          </div>
          <div className="absolute -bottom-1 -left-1 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-400">
            <div className="w-1.5 h-1.5 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full animate-pulse"></div>
          </div>
          
          {/* Enhanced pulsing ring */}
          <div className="absolute inset-0 border-2 border-green-400/0 group-hover:border-green-400/60 rounded-2xl group-hover:rounded-xl transition-all duration-500">
            <div className="absolute inset-0 border-2 border-green-300/0 group-hover:border-green-300/30 rounded-2xl group-hover:rounded-xl animate-pulse delay-200"></div>
          </div>
        </div>
        
       {/* Enhanced tooltip with improved design */}
        <div
          className="fixed left-20 bg-gradient-to-br from-black/98 via-gray-900/98 to-slate-900/98 backdrop-blur-2xl text-white px-5 py-4 rounded-2xl text-sm font-medium opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-500 whitespace-nowrap z-[9999] border border-white/30 shadow-2xl"
          style={{
            top: 'calc(14px + 24px + 56px + 12px + 72px * ' + (servers.length + 1) + ' - 12px)'
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse shadow-lg"></div>
            <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent font-bold text-base">
              Add a Server
            </span>
          </div>
          <div className="mt-2 text-xs text-gray-300 font-medium">Create or join a community</div>

          {/* Enhanced left-pointing arrow */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 w-0 h-0 border-r-12 border-r-black/98 border-t-6 border-b-6 border-t-transparent border-b-transparent drop-shadow-lg"></div>
          
          {/* Additional glow around tooltip */}
          <div className="absolute -inset-2 bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-teal-500/20 rounded-2xl blur-xl opacity-50"></div>
        </div>
      </div>
    </div>
  );
};

export default ServersSidebar;