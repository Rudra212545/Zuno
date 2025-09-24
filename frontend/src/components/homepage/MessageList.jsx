// components/homepage/MessageList.jsx - MINIMAL CHANGES
import React, { useEffect, useRef, useState } from 'react';
import { Crown, Shield, Zap, Plus } from 'lucide-react';
import { isToday, isYesterday, format, formatDistanceToNow } from 'date-fns';
import MessageReactions from './MessageReactions';
import EmojiPicker from './EmojiPicker';
import ScrollToBottomButton from './ScrollToBottomButton';
import socketService from '../../utils/socket';
import { useSelector } from 'react-redux';

const MessageList = ({ messages, lastReadMessageId, onNewMessage = null }) => {
  const unreadRef = useRef(null);
  const scrollContainerRef = useRef(null); // ✅ Add scroll container ref
  const [showEmojiPicker, setShowEmojiPicker] = useState(null);
  const [messageReactions, setMessageReactions] = useState({});
  const [showScrollButton, setShowScrollButton] = useState(false); // ✅ Scroll button state
  const [isAtBottom, setIsAtBottom] = useState(true); // ✅ Track if user is at bottom
  const [newMessagesCount, setNewMessagesCount] = useState(0); // ✅ Track new messages
  const user = useSelector((state) => state.user.user);

  // ✅ Scroll detection logic
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100; // 100px threshold
      
      setIsAtBottom(isNearBottom);
      setShowScrollButton(!isNearBottom);
      
      // Clear new message count when user scrolls to bottom
      if (isNearBottom) {
        setNewMessagesCount(0);
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial check
    handleScroll();

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // ✅ Auto-scroll to bottom for new messages (only if user was at bottom)
  useEffect(() => {
    if (messages.length > 0 && isAtBottom) {
      scrollToBottom();
    }
  }, [messages.length, isAtBottom]);

  // ✅ Track new messages when user is not at bottom
  useEffect(() => {
    if (messages.length > 0 && !isAtBottom) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && lastMessage.author?._id !== user?._id) {
        setNewMessagesCount(prev => prev + 1);
        
        // Call onNewMessage callback if provided
        if (onNewMessage) {
          onNewMessage(lastMessage);
        }
      }
    }
  }, [messages, isAtBottom, user?._id, onNewMessage]);

  // ✅ Scroll to bottom function
  const scrollToBottom = (smooth = true) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: smooth ? 'smooth' : 'instant'
      });
      setNewMessagesCount(0);
      setIsAtBottom(true);
    }
  };

  // ... ALL YOUR EXISTING REACTION CODE (unchanged) ...
  useEffect(() => {
    const handleReactionAdded = ({ messageId, reaction, userId }) => {
      console.log('😀 Reaction added:', { messageId, reaction });
      setMessageReactions(prev => ({
        ...prev,
        [messageId]: {
          ...prev[messageId],
          [reaction.emoji]: reaction
        }
      }));
    };

    const handleReactionRemoved = ({ messageId, reaction, emoji }) => {
      console.log('😀 Reaction removed:', { messageId, emoji });
      setMessageReactions(prev => {
        const newReactions = { ...prev };
        if (newReactions[messageId]) {
          if (reaction) {
            newReactions[messageId][emoji] = reaction;
          } else {
            delete newReactions[messageId][emoji];
          }
        }
        return newReactions;
      });
    };

    if (socketService.socket) {
      socketService.socket.on('reactionAdded', handleReactionAdded);
      socketService.socket.on('reactionRemoved', handleReactionRemoved);
    }

    return () => {
      if (socketService.socket) {
        socketService.socket.off('reactionAdded', handleReactionAdded);
        socketService.socket.off('reactionRemoved', handleReactionRemoved);
      }
    };
  }, []);

  useEffect(() => {
    const reactions = {};
    messages.forEach(message => {
      if (message.reactions && message.reactions.length > 0) {
        reactions[message._id] = {};
        message.reactions.forEach(reaction => {
          reactions[message._id][reaction.emoji] = reaction;
        });
      }
    });
    setMessageReactions(reactions);
  }, [messages]);

  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach((msg) => {
      const date = new Date(msg.timestamp || msg.createdAt);
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

  const handleEmojiSelect = (messageId, emoji) => {
    console.log('😀 Adding reaction:', { messageId, emoji });
    socketService.socket?.emit('addReaction', { messageId, emoji });
    setShowEmojiPicker(null);
  };

  const handleReactionClick = (messageId, emoji, userReacted) => {
    const eventType = userReacted ? 'removeReaction' : 'addReaction';
    console.log(`😀 ${userReacted ? 'Removing' : 'Adding'} reaction:`, { messageId, emoji });
    socketService.socket?.emit(eventType, { messageId, emoji });
  };

  useEffect(() => {
    if (unreadRef.current) {
      unreadRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [messages]);

  // ✅ FIXED: Add wrapper and attach ref + render ScrollToBottomButton
  return (
    <div className="h-full relative flex flex-col">
      <div 
        ref={scrollContainerRef} // ✅ ATTACH REF TO SCROLLING CONTAINER
        className="h-full overflow-y-auto p-3 md:p-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent"
      >
        {Object.entries(groupedMessages).map(([dateLabel, msgs]) => (
          <div key={dateLabel}>
            <div className="text-center text-gray-400 text-xs font-semibold mb-4">
              — {dateLabel} —
            </div>
            {msgs.map((message) => {
              const {
                _id,
                content,
                message: messageContent,
                timestamp,
                createdAt,
                author,
                sender,
                user: msgUser,
              } = message;

              const username = 
                author?.username ||
                sender?.username ||
                msgUser?.username ||
                'Unknown User';

              const avatar = 
                author?.avatar?.url ||
                author?.avatar ||
                sender?.avatar?.url ||
                sender?.avatar ||
                msgUser?.avatar?.url ||
                msgUser?.avatar ||
                null;

              const role = 
                author?.role ||
                sender?.role ||
                msgUser?.role ||
                'user';

              const messageText = content || messageContent || '[No content]';
              const messageTime = timestamp || createdAt;
              const isUnread = lastReadMessageId && _id === lastReadMessageId;

              // Get reactions for this message
              const msgReactions = messageReactions[_id] ? Object.values(messageReactions[_id]) : [];

              return (
                <div
                  key={_id}
                  ref={isUnread ? unreadRef : null}
                  className={`group relative flex items-start hover:bg-gray-700/20 px-3 md:px-6 py-3 md:py-4 -mx-3 md:-mx-6 rounded-xl md:rounded-2xl transition-all duration-200 ${
                    isUnread ? 'bg-gray-700/30 border-l-4 border-indigo-500' : ''
                  }`}
                >
                  {avatar ? (
                    <img
                      src={avatar}
                      alt={username}
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full mr-3 md:mr-4 flex-shrink-0 ring-2 ring-gray-600/50 ring-offset-2 ring-offset-gray-700 group-hover:ring-indigo-500/50 transition-all duration-200"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  
                  <div
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-full mr-3 md:mr-4 flex-shrink-0 ring-2 ring-gray-600/50 ring-offset-2 ring-offset-gray-700 group-hover:ring-indigo-500/50 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg md:text-xl select-none transition-all duration-200 ${
                      avatar ? 'hidden' : 'flex'
                    }`}
                    title={username}
                  >
                    {username.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center mb-2 md:mb-3">
                      <span className={`font-bold mr-2 md:mr-3 text-sm md:text-lg ${getRoleColor(role)}`}>
                        {username}
                      </span>
                      {getRoleIcon(role)}
                      <span className="text-xs text-gray-500 ml-auto font-medium hidden sm:block">
                        {messageTime ? formatDistanceToNow(new Date(messageTime), { addSuffix: true }) : 'Unknown time'}
                      </span>
                    </div>
                    <p className="text-gray-200 leading-relaxed text-sm md:text-base">
                      {messageText}
                    </p>
                    
                    {/* ✅ Message Reactions */}
                    <MessageReactions
                      reactions={msgReactions}
                      onReactionClick={(emoji, userReacted) => handleReactionClick(_id, emoji, userReacted)}
                      currentUserId={user?._id}
                    />

                    <span className="text-xs text-gray-500 font-medium sm:hidden block mt-1">
                      {messageTime ? formatDistanceToNow(new Date(messageTime), { addSuffix: true }) : 'Unknown time'}
                    </span>
                  </div>

                  {/* ✅ Add Reaction Button */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-2">
                    <button
                      onClick={() => setShowEmojiPicker(showEmojiPicker === _id ? null : _id)}
                      className="p-1 text-gray-400 hover:text-white hover:bg-gray-600/50 rounded"
                      title="Add reaction"
                    >
                      <Plus size={16} />
                    </button>
                    
                    {/* ✅ Emoji Picker */}
                    {showEmojiPicker === _id && (
                      <EmojiPicker
                        onEmojiSelect={(emoji) => handleEmojiSelect(_id, emoji)}
                        onClose={() => setShowEmojiPicker(null)}
                        position="left"
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* ✅ ADD THE SCROLL BUTTON (This was missing!) */}
      <ScrollToBottomButton
        isVisible={showScrollButton}
        onClick={() => scrollToBottom()}
        hasNewMessages={newMessagesCount > 0}
        newMessageCount={newMessagesCount}
      />
    </div>
  );
};

export default MessageList;
