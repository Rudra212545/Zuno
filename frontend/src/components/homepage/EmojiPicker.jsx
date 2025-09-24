// components/homepage/EmojiPicker.jsx
import React, { useState } from 'react';

const commonEmojis = [
  '👍', '👎', '❤️', '😄', '😢', '😮', '😡', '🎉', '🔥', '💯',
  '👏', '💪', '🙌', '✅', '❌', '⭐', '💙', '💚', '💛', '💜'
];

const EmojiPicker = ({ onEmojiSelect, onClose, position = 'bottom' }) => {
  const [selectedCategory, setSelectedCategory] = useState('common');

  const positionClasses = {
    bottom: 'bottom-full mb-2',
    top: 'top-full mt-2',
    left: 'right-full mr-2',
    right: 'left-full ml-2'
  };

  return (
    <div className={`absolute ${positionClasses[position]} left-0 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-50 p-2 min-w-64`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-600">
        <span className="text-sm font-medium text-white">Add Reaction</span>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white text-lg leading-none"
        >
          ×
        </button>
      </div>

      {/* Emoji Grid */}
      <div className="grid grid-cols-8 gap-1 max-h-40 overflow-y-auto">
        {commonEmojis.map((emoji, index) => (
          <button
            key={index}
            onClick={() => onEmojiSelect(emoji)}
            className="p-2 text-xl hover:bg-gray-700 rounded transition-colors"
            title={`React with ${emoji}`}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmojiPicker;
