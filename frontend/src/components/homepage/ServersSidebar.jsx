import React from 'react';
import { Plus } from 'lucide-react';

const ServersSidebar = ({ servers, onOpenAddServer }) => {
  console.log("Servers data:", servers);
  return (
    <div className="hidden md:flex w-20 bg-gradient-to-b from-slate-900 to-gray-900 flex-col items-center py-6 space-y-3 border-r border-gray-700/30 mt-14 shadow-xl overflow-auto">
      {/* Home/Direct Messages */}
      <div className="relative group">
        <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-300 hover:rounded-xl hover:shadow-xl hover:shadow-indigo-500/30 hover:scale-110 group-hover:rotate-3">
          <span className="text-white font-bold text-xl drop-shadow-lg">D</span>
        </div>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-white rounded-r-full transition-all duration-300 group-hover:h-8 shadow-lg"></div>
        <div className="absolute left-20 top-1/2 -translate-y-1/2 bg-black/90 backdrop-blur-sm text-white px-3 py-2 rounded-xl text-sm font-medium opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-50 border border-gray-600/50 shadow-xl">
          Direct Messages
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-0 h-0 border-r-8 border-r-black/90 border-t-4 border-b-4 border-t-transparent border-b-transparent"></div>
        </div>
      </div>
      
      <div className="w-10 h-0.5 bg-gradient-to-r from-transparent via-gray-600 to-transparent rounded-full"></div>
      
      {/* Server Icons */}
      {servers.map((server) => (
        <div key={server.id} className="relative group">
          <div className={`w-14 h-14 ${server.active ? 'bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-xl shadow-indigo-500/30' : 'bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl hover:rounded-xl hover:bg-gradient-to-br hover:from-indigo-500 hover:to-purple-600 hover:shadow-xl hover:shadow-indigo-500/30'} flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 group-hover:rotate-3`}>
          <img
            src={server.iconUrl}
            alt={`${server.name} icon`}
            className="w-8 h-8"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/40'; // fallback image
              console.error('Image failed to load:', server.icon);
            }}
          />

          </div>
          {server.notifications > 0 && (
            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg animate-bounce">
              {server.notifications > 9 ? '9+' : server.notifications}
            </div>
          )}
          {server.active && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 bg-white rounded-r-full shadow-lg"></div>
          )}
          <div className="absolute left-20 top-1/2 -translate-y-1/2 bg-black/90 backdrop-blur-sm text-white px-3 py-2 rounded-xl text-sm font-medium opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-50 border border-gray-600/50 shadow-xl">
            {server.name}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-0 h-0 border-r-8 border-r-black/90 border-t-4 border-b-4 border-t-transparent border-b-transparent"></div>
          </div>
        </div>
      ))}
      
      {/* Add Server */}
      <div className="relative group">
        <div  onClick={onOpenAddServer}
         className="w-14 h-14 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-300 hover:rounded-xl hover:bg-gradient-to-br hover:from-green-500 hover:to-emerald-600 text-green-400 hover:text-white hover:scale-110 hover:shadow-xl hover:shadow-green-500/30 group-hover:rotate-3">
          <Plus size={28} className="group-hover:rotate-90 transition-transform duration-300" />
        </div>
        <div className="absolute left-20 top-1/2 -translate-y-1/2 bg-black/90 backdrop-blur-sm text-white px-3 py-2 rounded-xl text-sm font-medium opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-50 border border-gray-600/50 shadow-xl">
          Add a Server
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-0 h-0 border-r-8 border-r-black/90 border-t-4 border-b-4 border-t-transparent border-b-transparent"></div>
        </div>
      </div>
    </div>
  );
};

export default ServersSidebar;