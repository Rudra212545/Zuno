// components/homepage/ScrollToBottomButton.jsx - Create this file
import React from 'react';
import { ChevronDown } from 'lucide-react';

const ScrollToBottomButton = ({ 
  isVisible, 
  onClick, 
  hasNewMessages = false,
  newMessageCount = 0 
}) => {
  // ✅ Add debug logging
  console.log('ScrollToBottomButton render:', {
    isVisible,
    hasNewMessages,
    newMessageCount
  });

  if (!isVisible) {
    console.log('ScrollToBottomButton: Not visible, not rendering');
    return null;
  }

  console.log('✅ ScrollToBottomButton: Rendering button');

  return (
    <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-50">
      <button
        onClick={onClick}
        className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 border border-white/20 backdrop-blur-sm"
        title={hasNewMessages ? `${newMessageCount} new message${newMessageCount > 1 ? 's' : ''}` : 'Scroll to bottom'}
      >
        {hasNewMessages && newMessageCount > 0 && (
          <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold min-w-[20px] text-center">
            {newMessageCount > 99 ? '99+' : newMessageCount}
          </div>
        )}
        
        <ChevronDown size={20} className="transition-transform duration-200" />
        
        {!hasNewMessages && (
          <span className="text-sm font-medium hidden sm:block">
            Jump to present
          </span>
        )}
      </button>
    </div>
  );
};

export default ScrollToBottomButton;
