// components/homepage/ChatArea.jsx - FIXED VERSION with proper layout
import React, { useEffect, useMemo, useState, useRef } from 'react';
import { Hash, Bell, Pin, Users, Smile, Send, Video } from 'lucide-react';
import MessageList from './MessageList';
import CallUi from './CallUi';
import TypingIndicator from './TypingIndicator';
import socketService from '../../utils/socket';

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
  const [typingUsers, setTypingUsers] = useState([]);
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);

  const currentChannelObj = channels.find(c => c._id === currentChannelId);
  const isVoiceChannel = currentChannelObj?.type === 'voice';

  // ✅ Set up typing listeners
  useEffect(() => {
    const handleUserTyping = ({ userId, username, isTyping, channelId }) => {
      if (channelId !== currentChannelId) return;
      
      console.log('✏️ Typing update:', { username, isTyping });
      
      setTypingUsers(prev => {
        const filtered = prev.filter(user => user.userId !== userId);
        
        if (isTyping) {
          return [...filtered, { userId, username }];
        } else {
          return filtered;
        }
      });

      if (isTyping) {
        setTimeout(() => {
          setTypingUsers(prev => prev.filter(user => user.userId !== userId));
        }, 3000);
      }
    };

    socketService.onUserTyping(handleUserTyping);

    return () => {
      socketService.socket?.off('userTyping', handleUserTyping);
    };
  }, [currentChannelId]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setMessageInput(value);

    if (value.length > 0 && !isTypingRef.current) {
      isTypingRef.current = true;
      socketService.sendTypingIndicator(currentChannelId, true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (isTypingRef.current) {
        isTypingRef.current = false;
        socketService.sendTypingIndicator(currentChannelId, false);
      }
    }, 1000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isTypingRef.current) {
      isTypingRef.current = false;
      socketService.sendTypingIndicator(currentChannelId, false);
    }
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    handleSendMessage(e);
  };

  useEffect(() => {
    return () => {
      if (isTypingRef.current) {
        socketService.sendTypingIndicator(currentChannelId, false);
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [currentChannelId]);

  const channelMessages = useMemo(() => {
    if (!messages || !currentChannelId) return [];
    
    const filtered = messages.filter((msg) => {
      const msgChannelId = 
        msg.channelId ||
        msg.channel?._id ||
        msg.channel;
      return String(msgChannelId) === String(currentChannelId);
    });
    
    return filtered;
  }, [messages, currentChannelId]);

  useEffect(() => {
    setShowVoiceChat(false);
    if (currentChannelId && channelMessages.length > 0) {
      localStorage.setItem(`lastRead:${currentChannelId}`, new Date().toISOString());
    }
  }, [currentChannelId, channelMessages.length]);

  // ✅ ENHANCED INPUT BOX with better styling
  const renderInputBox = () => (
    <div className="flex-shrink-0 bg-gradient-to-t from-slate-800/90 to-gray-700/90 backdrop-blur-md border-t border-gray-600/30">
      {/* ✅ Typing Indicator */}
      <TypingIndicator typingUsers={typingUsers} />
      
      <div className="p-4 md:p-6">
        <form
          onSubmit={handleSubmit}
          className="relative bg-gray-600/60 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl border border-gray-500/40 hover:border-gray-400/50 transition-all duration-200"
        >
          <input
            type="text"
            value={messageInput}
            onChange={handleInputChange}
            placeholder={`Message #${currentChannel?.name || currentChannel}`}
            className="w-full bg-transparent text-white px-5 md:px-6 py-4 md:py-5 pr-20 md:pr-24 focus:outline-none placeholder-gray-400 text-sm md:text-base font-medium resize-none"
            autoComplete="off"
          />
          <div className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 flex items-center space-x-2">
            <button
              type="button"
              className="text-gray-400 hover:text-white p-2 md:p-2.5 rounded-xl hover:bg-gray-700/60 transition-all duration-200 hover:scale-110"
              title="Add emoji"
            >
              <Smile size={18} />
            </button>
            <button
              type="submit"
              disabled={!messageInput.trim()}
              className={`p-2 md:p-2.5 rounded-xl transition-all duration-200 ${
                messageInput.trim()
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-110'
                  : 'bg-gray-600/50 text-gray-500 cursor-not-allowed'
              }`}
              title="Send message"
            >
              <Send size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const handleNewMessage = (message) => {
    console.log('🔔 New message received while scrolled up:', message);
  };

  // ✅ FIXED LAYOUT STRUCTURE
  return (
    <div className="flex-1 flex flex-col bg-gradient-to-b from-gray-700 to-slate-700 mt-14 min-w-0 max-h-screen overflow-hidden">
      {/* ✅ Header - Fixed height */}
      <div className="h-14 md:h-16 px-4 md:px-6 flex items-center justify-between border-b border-gray-600/30 bg-gradient-to-r from-gray-700/80 to-slate-700/80 backdrop-blur-sm shadow-lg flex-shrink-0">
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
            <div className="flex-1 min-h-0">
              <CallUi channelId={callChannelId} onEndCall={onEndCall} />
            </div>
          ) : (
            <>
              {/* ✅ MessageList - Takes remaining space */}
              <div className="flex-1 min-h-0 overflow-hidden">
                <MessageList 
                  messages={channelMessages} 
                  lastReadMessageId={unreadMessageId}
                  onNewMessage={handleNewMessage}
                />
              </div>
              
              {/* ✅ Input Box - Fixed at bottom */}
              {renderInputBox()}
            </>
          )}

          {/* ✅ Voice controls - Fixed at bottom */}
          <div className="flex justify-center p-4 bg-gray-800/50 border-t border-gray-600/30 flex-shrink-0">
            <button
              onClick={() => setShowVoiceChat(prev => !prev)}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 gap-3"
            >
              <Video size={18} />
              <span className="font-medium">
                {showVoiceChat ? 'Back to Call' : 'Show Chat'}
              </span>
            </button>
          </div>
        </>
      ) : (
        <>
          {/* ✅ TEXT CHANNEL - MessageList takes remaining space */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <MessageList 
              messages={channelMessages} 
              lastReadMessageId={unreadMessageId}
              onNewMessage={handleNewMessage}
            />
          </div>
          
          {/* ✅ Input Box - Always visible at bottom */}
          {renderInputBox()}
        </>
      )}
    </div>
  );
};

export default ChatArea;
