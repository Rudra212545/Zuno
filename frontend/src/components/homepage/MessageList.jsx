import React, { useEffect, useRef } from 'react';
import { Crown, Shield, Zap } from 'lucide-react';
import { isToday, isYesterday, format, formatDistanceToNow } from 'date-fns';

const MessageList = ({ messages, lastReadMessageId }) => {
  const unreadRef = useRef(null);

  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach((msg) => {
      const date = new Date(msg.timestamp);
      let label = format(date, 'yyyy-MM-dd');

      if (isToday(date)) label = 'Today';
      else if (isYesterday(date)) label = 'Yesterday';
      else label = format(date, 'dd MMM yyyy');

      if (!groups[label]) groups[label] = [];
      groups[label].push(msg);
    });
    return groups;
  };

  const groupedMessages = groupMessagesByDate(messages);

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <Crown size={14} className="text-yellow-400" />;
      case 'moderator':
        return <Shield size={14} className="text-blue-400" />;
      case 'bot':
        return <Zap size={14} className="text-green-400" />;
      default:
        return null;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'text-yellow-400';
      case 'moderator':
        return 'text-blue-400';
      case 'bot':
        return 'text-green-400';
      default:
        return 'text-white';
    }
  };

  // Scroll to first unread message
  useEffect(() => {
    if (unreadRef.current) {
      unreadRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
      {Object.entries(groupedMessages).map(([dateLabel, msgs]) => (
        <div key={dateLabel}>
          <div className="text-center text-gray-400 text-xs font-semibold mb-4">
            — {dateLabel} —
          </div>
          {msgs.map((message) => {
            const {
              _id,
              content,
              timestamp,
              user = {},
            } = message;

            const username = user.username || 'Unknown';
            const role = user.role || 'user';
            const avatar = user.avatar?.url || null;

            const isUnread = lastReadMessageId && _id === lastReadMessageId;

            return (
              <div
                key={_id}
                ref={isUnread ? unreadRef : null}
                className={`flex items-start group hover:bg-gray-700/20 px-3 md:px-6 py-3 md:py-4 -mx-3 md:-mx-6 rounded-xl md:rounded-2xl transition-all duration-200 ${
                  isUnread ? 'bg-gray-700/30 border-l-4 border-indigo-500' : ''
                }`}
              >
                {avatar ? (
                  <img
                    src={avatar}
                    alt={username}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full mr-3 md:mr-4 flex-shrink-0 ring-2 ring-gray-600/50 ring-offset-2 ring-offset-gray-700 group-hover:ring-indigo-500/50 transition-all duration-200"
                  />
                ) : (
                  <div
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full mr-3 md:mr-4 flex-shrink-0 ring-2 ring-gray-600/50 ring-offset-2 ring-offset-gray-700 group-hover:ring-indigo-500/50 bg-gray-700 flex items-center justify-center text-white font-bold text-lg md:text-xl select-none transition-all duration-200"
                    title={username}
                  >
                    {username.charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center mb-2 md:mb-3">
                    <span className={`font-bold mr-2 md:mr-3 text-sm md:text-lg ${getRoleColor(role)}`}>
                      {username}
                    </span>
                    {getRoleIcon(role)}
                    <span className="text-xs text-gray-500 ml-auto font-medium hidden sm:block">
                      {formatDistanceToNow(new Date(timestamp), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-gray-200 leading-relaxed text-sm md:text-base">{content}</p>
                  <span className="text-xs text-gray-500 font-medium sm:hidden block mt-1">
                    {formatDistanceToNow(new Date(timestamp), { addSuffix: true })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default MessageList;
