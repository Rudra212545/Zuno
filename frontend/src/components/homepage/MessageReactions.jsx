// components/homepage/MessageReactions.jsx
import React from 'react';

const MessageReactions = ({ reactions = [], onReactionClick, currentUserId }) => {
  if (!reactions || reactions.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {reactions.map((reaction) => {
        const userReacted = reaction.users.includes(currentUserId);
        
        return (
          <button
            key={reaction.emoji}
            onClick={() => onReactionClick(reaction.emoji, userReacted)}
            className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs transition-colors ${
              userReacted
                ? 'bg-indigo-500/20 border border-indigo-500 text-indigo-300'
                : 'bg-gray-700/50 border border-gray-600 text-gray-300 hover:bg-gray-600/50'
            }`}
            title={userReacted ? 'Remove reaction' : 'Toggle reaction'}
          >
            <span>{reaction.emoji}</span>
            <span className="text-xs">{reaction.count}</span>
          </button>
        );
      })}
    </div>
  );
};

export default MessageReactions;
