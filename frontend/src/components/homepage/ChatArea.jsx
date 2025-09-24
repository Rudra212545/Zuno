import React, { useEffect, useMemo, useState } from 'react';
import { Hash, Bell, Pin, Users, Smile, Send, Video } from 'lucide-react';
import MessageList from './MessageList';
import CallUi from './CallUi';

const ChatArea = ({
  currentChannel,
  currentChannelId,
  messages,
  channels,
  messageInput,
  setMessageInput,
  handleSendMessage,
  callActive,
  callChannelId,
  onEndCall,
}) => {
  const [unreadMessageId, setUnreadMessageId] = useState(null);
  const [showVoiceChat, setShowVoiceChat] = useState(false);

  const currentChannelObj = channels.find(c => c._id === currentChannelId);
  const isVoiceChannel = currentChannelObj?.type === 'voice';

  const channelMessages = useMemo(() => {
    return messages.filter(msg => msg.channel?._id === currentChannelId);
  }, [messages, currentChannelId]);

  useEffect(() => {
    const lastReadAt = localStorage.getItem(`lastRead:${currentChannelId}`);
    if (!lastReadAt) {
      setUnreadMessageId(null);
      return;
    }
    const unread = channelMessages.find(msg => new Date(msg.timestamp) > new Date(lastReadAt));
    setUnreadMessageId(unread ? unread._id : null);
  }, [channelMessages, currentChannelId]);

  useEffect(() => {
    setShowVoiceChat(false); // Reset toggle on channel change
    if (currentChannelId && channelMessages.length > 0) {
      localStorage.setItem(`lastRead:${currentChannelId}`, new Date().toISOString());
    }
  }, [currentChannelId, channelMessages.length]);

  const renderInputBox = () => (
    <div className="p-3 md:p-6 bg-gradient-to-t from-slate-800/80 to-gray-700/80 backdrop-blur-sm">
      <form
        onSubmit={handleSendMessage}
        className="relative bg-gray-600/50 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border border-gray-500/30"
      >
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder={`Message #${currentChannel?.name || currentChannel}`}
          className="w-full bg-transparent text-white px-4 md:px-6 py-3 md:py-4 pr-16 md:pr-20 focus:outline-none placeholder-gray-400 text-sm font-medium"
        />
        <div className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1 md:space-x-2">
          <button
            type="button"
            className="text-gray-400 hover:text-white p-1.5 md:p-2 rounded-xl hover:bg-gray-700/50 hover:scale-110"
          >
            <Smile size={18} />
          </button>
          <button
            type="submit"
            disabled={!messageInput.trim()}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-1.5 md:p-2 rounded-xl hover:shadow-lg hover:scale-110"
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-b from-gray-700 to-slate-700 mt-14 min-w-0">
      {/* Header */}
      <div className="h-14 md:h-16 px-4 md:px-6 flex items-center justify-between border-b border-gray-600/30 bg-gradient-to-r from-gray-700/80 to-slate-700/80 backdrop-blur-sm shadow-lg">
        <div className="flex items-center">
          <Hash size={20} className="md:w-6 md:h-6 text-gray-400 mr-2 md:mr-4" />
          <div>
            <span className="font-bold text-white text-lg md:text-xl">
              {currentChannel?.name || currentChannel}
            </span>
            <div className="h-1 w-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full group-hover:w-full transition-all duration-500"></div>
          </div>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          {[Bell, Pin, Users].map((Icon, idx) => (
            <button
              key={idx}
              className="p-2.5 text-gray-400 hover:text-white hover:bg-gray-600/30 rounded-xl transition-all duration-200 hover:scale-110"
            >
              <Icon size={20} />
            </button>
          ))}
        </div>
      </div>

      {isVoiceChannel ? (
        <>
          {callActive && callChannelId === currentChannelId && !showVoiceChat ? (
            <CallUi channelId={callChannelId} onEndCall={onEndCall} />
          ) : (
            <>
              <MessageList messages={channelMessages} unreadMessageId={unreadMessageId} />
              {renderInputBox()}
            </>
          )}

          {/* Toggle Button */}
          <div className="flex justify-center mt-4 mb-2">
            <button
              onClick={() => setShowVoiceChat(prev => !prev)}
              className="flex items-center px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition gap-2"
            >
              <Video size={18} />
              {showVoiceChat ? 'Back to Call' : 'Show Chat'}
            </button>
          </div>
        </>
      ) : (
        <>
          <MessageList messages={channelMessages} unreadMessageId={unreadMessageId} />
          {renderInputBox()}
        </>
      )}
    </div>
  );
};

export default ChatArea;
