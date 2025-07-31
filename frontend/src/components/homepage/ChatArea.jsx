import React, { useEffect, useMemo, useState } from 'react';
import { Hash, Bell, Pin, Users, Smile, Send } from 'lucide-react';
import MessageList from './MessageList';

const ChatArea = ({ 
  currentChannel, 
  currentChannelId,
  messages, 
  messageInput, 
  setMessageInput, 
  handleSendMessage 
}) => {
  const [unreadMessageId, setUnreadMessageId] = useState(null);

  // Step 1: Get filtered messages for the selected channel
  const channelMessages = useMemo(() => 
    messages.filter(msg => msg.channel?._id === currentChannelId),
    [messages, currentChannelId]
  );

  // Step 2: Detect first unread message (based on timestamp)
  useEffect(() => {
    const lastReadAt = localStorage.getItem(`lastRead:${currentChannelId}`);
    if (!lastReadAt) return;

    const unread = channelMessages.find(msg => new Date(msg.timestamp) > new Date(lastReadAt));
    if (unread) {
      setUnreadMessageId(unread._id); // used to scroll into view
    }
  }, [channelMessages, currentChannelId]);

  // Step 3: Mark messages as read when opening the channel
  useEffect(() => {
    if (currentChannelId && channelMessages.length > 0) {
      localStorage.setItem(`lastRead:${currentChannelId}`, new Date().toISOString());
    }
  }, [currentChannelId]);

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-b from-gray-700 to-slate-700 mt-14 min-w-0">

      {/* Header */}
      <div className="h-14 md:h-16 px-4 md:px-6 flex items-center justify-between border-b border-gray-600/30 bg-gradient-to-r from-gray-700/80 to-slate-700/80 backdrop-blur-sm shadow-lg">
        <div className="flex items-center">
          <Hash size={20} className="md:w-6 md:h-6 text-gray-400 mr-2 md:mr-4" />
          <div>
            <span className="font-bold text-white text-lg md:text-xl">{currentChannel}</span>
            <div className="h-1 w-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full group-hover:w-full transition-all duration-500"></div>
          </div>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          {[{ icon: Bell }, { icon: Pin }, { icon: Users }].map((item, index) => (
            <button key={index} className="p-2.5 text-gray-400 hover:text-white hover:bg-gray-600/30 rounded-xl transition-all duration-200 hover:scale-110">
              <item.icon size={20} />
            </button>
          ))}
        </div>
      </div>

      {/* MessageList with scroll to unread */}
      <MessageList 
        messages={channelMessages}
        unreadMessageId={unreadMessageId}
      />

      {/* Input */}
      <div className="p-3 md:p-6 bg-gradient-to-t from-slate-800/80 to-gray-700/80 backdrop-blur-sm">
        <form onSubmit={handleSendMessage} className="relative bg-gray-600/50 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border border-gray-500/30">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder={`Message #${currentChannel}`}
            className="w-full bg-transparent text-white px-4 md:px-6 py-3 md:py-4 pr-16 md:pr-20 focus:outline-none placeholder-gray-400 text-sm font-medium"
          />
          <div className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1 md:space-x-2">
            <button type="button" className="text-gray-400 hover:text-white p-1.5 md:p-2 rounded-xl hover:bg-gray-700/50 hover:scale-110">
              <Smile size={18} />
            </button>
            <button type="submit" disabled={!messageInput.trim()} className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-1.5 md:p-2 rounded-xl hover:shadow-lg hover:scale-110">
              <Send size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatArea;
