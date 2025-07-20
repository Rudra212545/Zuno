import React from 'react';
import { Crown, Shield, Zap } from 'lucide-react';

const MessageList = ({ messages }) => {
  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return <Crown size={14} className="text-yellow-400" />;
      case 'moderator': return <Shield size={14} className="text-blue-400" />;
      case 'bot': return <Zap size={14} className="text-green-400" />;
      default: return null;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'text-yellow-400';
      case 'moderator': return 'text-blue-400';
      case 'bot': return 'text-green-400';
      default: return 'text-white';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-4 md:space-y-6 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
      {messages.map((message) => (
        <div key={message.id} className="flex items-start group hover:bg-gray-700/20 px-3 md:px-6 py-3 md:py-4 -mx-3 md:-mx-6 rounded-xl md:rounded-2xl transition-all duration-200">
          <img 
            src={message.avatar} 
            alt={message.user}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full mr-3 md:mr-4 flex-shrink-0 ring-2 ring-gray-600/50 ring-offset-2 ring-offset-gray-700 group-hover:ring-indigo-500/50 transition-all duration-200"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center mb-2 md:mb-3">
              <span className={`font-bold mr-2 md:mr-3 text-sm md:text-lg ${getRoleColor(message.role)}`}>{message.user}</span>
              {getRoleIcon(message.role)}
              <span className="text-xs text-gray-500 ml-auto font-medium hidden sm:block">{message.timestamp}</span>
            </div>
            <p className="text-gray-200 leading-relaxed text-sm md:text-base">{message.content}</p>
            <span className="text-xs text-gray-500 font-medium sm:hidden block mt-1">{message.timestamp}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;