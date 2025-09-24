// components/homepage/TypingIndicator.jsx
import React from 'react';

const TypingIndicator = ({ typingUsers }) => {
  if (!typingUsers || typingUsers.length === 0) {
    return null;
  }

  const getTypingText = () => {
    const count = typingUsers.length;
    
    if (count === 1) {
      return `${typingUsers[0].username} is typing...`;
    } else if (count === 2) {
      return `${typingUsers[0].username} and ${typingUsers[1].username} are typing...`;
    } else if (count === 3) {
      return `${typingUsers[0].username}, ${typingUsers[1].username}, and ${typingUsers[2].username} are typing...`;
    } else {
      return `${typingUsers[0].username} and ${count - 1} others are typing...`;
    }
  };

  return (
    <div className="px-4 py-2 text-sm text-gray-400 flex items-center space-x-2">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
      <span className="italic">{getTypingText()}</span>
    </div>
  );
};

export default TypingIndicator;
