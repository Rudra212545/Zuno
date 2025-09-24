// components/homepage/OnlineUsers.jsx
import React from 'react';
import { Users } from 'lucide-react';

const OnlineUsers = ({ users = [], isOpen, onToggle }) => {
  const onlineUsers = users.filter(user => user.isOnline);
  const offlineUsers = users.filter(user => !user.isOnline);

  if (!isOpen) {
    return (
      <div className="hidden md:block">
        <button
          onClick={onToggle}
          className="flex items-center space-x-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-600/30 rounded-lg transition-all duration-200"
        >
          <Users size={16} />
          <span className="text-sm font-medium">
            {onlineUsers.length} online
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-60 bg-gray-800 border-l border-gray-600/50 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-600/50">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-white">Members</span>
          <button
            onClick={onToggle}
            className="text-gray-400 hover:text-white p-1 rounded"
          >
            ✕
          </button>
        </div>
        <span className="text-xs text-gray-400">
          {users.length} members, {onlineUsers.length} online
        </span>
      </div>

      {/* Online Users */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {onlineUsers.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
              Online — {onlineUsers.length}
            </h3>
            <div className="space-y-2">
              {onlineUsers.map((user) => (
                <UserItem key={user.userId} user={user} isOnline={true} />
              ))}
            </div>
          </div>
        )}

        {/* Offline Users */}
        {offlineUsers.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
              Offline — {offlineUsers.length}
            </h3>
            <div className="space-y-2">
              {offlineUsers.map((user) => (
                <UserItem key={user.userId} user={user} isOnline={false} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const UserItem = ({ user, isOnline }) => {
  return (
    <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-700/50 transition-colors">
      <div className="relative">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.username}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
            {user.username.charAt(0).toUpperCase()}
          </div>
        )}
        {/* Online status indicator */}
        <div
          className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-800 ${
            isOnline ? 'bg-green-500' : 'bg-gray-500'
          }`}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${isOnline ? 'text-white' : 'text-gray-400'}`}>
          {user.username}
        </p>
        {user.status && (
          <p className="text-xs text-gray-500 truncate">
            {user.status}
          </p>
        )}
      </div>
    </div>
  );
};

export default OnlineUsers;
