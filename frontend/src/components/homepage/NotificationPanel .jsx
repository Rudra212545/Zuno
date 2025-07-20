import React from 'react';
import { Bell, X, Check, UserPlus, MessageSquare, Users, Calendar } from 'lucide-react';

const NotificationPanel = ({ notifications, onClose }) => {
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'friend_request': return <UserPlus size={16} className="text-blue-400" />;
      case 'mention': return <MessageSquare size={16} className="text-yellow-400" />;
      case 'server_invite': return <Users size={16} className="text-green-400" />;
      case 'event': return <Calendar size={16} className="text-purple-400" />;
      default: return <Bell size={16} className="text-gray-400" />;
    }
  };

  return (
    <div className="absolute right-0 top-14 w-72 md:w-80 bg-gradient-to-b from-slate-900/95 to-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-600/30 py-4 z-50 max-h-96 overflow-y-auto">
      <div className="px-6 py-3 border-b border-gray-700/30 flex items-center justify-between">
        <h3 className="font-bold text-white text-lg">Notifications</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-gray-700/50 transition-all duration-200"
        >
          <X size={16} />
        </button>
      </div>
      
      <div className="py-2">
        {notifications.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-400">
            <Bell size={32} className="mx-auto mb-3 opacity-50" />
            <p className="font-medium">No new notifications</p>
            <p className="text-sm text-gray-500">You're all caught up!</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`px-6 py-4 hover:bg-gray-700/20 transition-all duration-200 border-l-3 ${
                notification.unread ? 'border-blue-500 bg-blue-500/5' : 'border-transparent'
              }`}
            >
              <div className="flex items-start space-x-4">
                <img
                  src={notification.avatar}
                  alt={notification.user}
                  className="w-10 h-10 rounded-full flex-shrink-0 ring-2 ring-gray-600/50"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    {getNotificationIcon(notification.type)}
                    <span className="font-semibold text-white text-sm">{notification.user}</span>
                    {notification.unread && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    )}
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{notification.message}</p>
                  {notification.content && (
                    <p className="text-gray-400 text-xs mt-2 italic bg-gray-800/50 rounded-lg p-2">"{notification.content}"</p>
                  )}
                  <p className="text-gray-500 text-xs mt-2 font-medium">{notification.time}</p>
                </div>
                {notification.type === 'friend_request' && notification.unread && (
                  <div className="flex space-x-2">
                    <button className="p-2 bg-green-600 hover:bg-green-500 rounded-lg text-white shadow-lg transition-all duration-200 hover:scale-110">
                      <Check size={14} />
                    </button>
                    <button className="p-2 bg-red-600 hover:bg-red-500 rounded-lg text-white shadow-lg transition-all duration-200 hover:scale-110">
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      
      {notifications.some(n => n.unread) && (
        <div className="px-6 py-3 border-t border-gray-700/30">
          <button className="text-blue-400 hover:text-blue-300 text-sm font-semibold transition-colors duration-200">
            Mark all as read
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;