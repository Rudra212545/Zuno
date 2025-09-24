// components/homepage/MessageList.jsx - PROPERLY STYLED VERSION
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
  const scrollContainerRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(null);
  const [messageReactions, setMessageReactions] = useState({});
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [newMessagesCount, setNewMessagesCount] = useState(0);
  const user = useSelector((state) => state.user.user);

  // ✅ Scroll detection logic
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      
      setIsAtBottom(isNearBottom);
      setShowScrollButton(!isNearBottom);
      
      if (isNearBottom) {
        setNewMessagesCount(0);
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // ✅ Auto-scroll to bottom for new messages
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

  // ✅ Reaction listeners
  useEffect(() => {
    const handleReactionAdded = ({ messageId, reaction, userId }) => {
      setMessageReactions(prev => ({
        ...prev,
        [messageId]: {
          ...prev[messageId],
          [reaction.emoji]: reaction
        }
      }));
    };

    const handleReactionRemoved = ({ messageId, reaction, emoji }) => {
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
    socketService.socket?.emit('addReaction', { messageId, emoji });
    setShowEmojiPicker(null);
  };

  const handleReactionClick = (messageId, emoji, userReacted) => {
    const eventType = userReacted ? 'removeReaction' : 'addReaction';
    socketService.socket?.emit(eventType, { messageId, emoji });
  };

  useEffect(() => {
    if (unreadRef.current) {
      unreadRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [messages]);

  // ✅ Empty state
  if (!messages || messages.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-gray-400">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-700/50 flex items-center justify-center">
            <span className="text-2xl">💬</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
          <p className="text-sm opacity-75">Start the conversation!</p>
        </div>
      </div>
    );
  }

  // ✅ PROPERLY STYLED CONTAINER STRUCTURE
  return (
    <div className="h-full relative flex flex-col">
      {/* ✅ Scrollable Messages Container */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600/50 scrollbar-track-transparent hover:scrollbar-thumb-gray-500/70"
        style={{
          scrollBehavior: 'smooth',
          scrollbarGutter: 'stable both-edges'
        }}
      >
        <div className="p-4 md:p-6 space-y-6">
          {Object.entries(groupedMessages).map(([dateLabel, msgs]) => (
            <div key={dateLabel}>
              {/* ✅ Enhanced Date Separator */}
              <div className="flex items-center justify-center my-6">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600/30 to-transparent"></div>
                <div className="px-4 py-1 bg-gray-800/80 rounded-full border border-gray-600/30">
                  <span className="text-xs font-semibold text-gray-300 tracking-wide">
                    {dateLabel}
                  </span>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600/30 to-transparent"></div>
              </div>

              {msgs.map((message, msgIndex) => {
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
                const msgReactions = messageReactions[_id] ? Object.values(messageReactions[_id]) : [];

                // ✅ Check if we should group with previous message
                const prevMessage = msgIndex > 0 ? msgs[msgIndex - 1] : null;
                const isGrouped = prevMessage && 
                  prevMessage.author?.username === username &&
                  new Date(messageTime).getTime() - new Date(prevMessage.timestamp || prevMessage.createdAt).getTime() < 300000; // 5 minutes

                return (
                  <div
                    key={_id}
                    ref={isUnread ? unreadRef : null}
                    className={`group relative flex items-start transition-all duration-200 ${
                      isGrouped 
                        ? 'mt-1 hover:bg-gray-700/10 rounded-lg py-1 px-2 -mx-2' 
                        : 'mt-4 hover:bg-gray-700/20 rounded-xl py-2 px-3 -mx-3'
                    } ${isUnread ? 'bg-indigo-500/10 border-l-4 border-indigo-500 pl-2' : ''}`}
                  >
                    {/* ✅ Avatar or Timestamp */}
                    {!isGrouped ? (
                      avatar ? (
                        <img
                          src={avatar}
                          alt={username}
                          className="w-10 h-10 rounded-full mr-3 flex-shrink-0 ring-2 ring-gray-700/50 hover:ring-indigo-500/50 transition-all duration-200"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : (
                        <div
                          className="w-10 h-10 rounded-full mr-3 flex-shrink-0 ring-2 ring-gray-700/50 hover:ring-indigo-500/50 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm transition-all duration-200"
                          title={username}
                        >
                          {username.charAt(0).toUpperCase()}
                        </div>
                      )
                    ) : (
                      <div className="w-10 mr-3 flex-shrink-0 flex items-center justify-center">
                        <span className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          {messageTime ? format(new Date(messageTime), 'HH:mm') : ''}
                        </span>
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      {/* ✅ Username and Timestamp (only for first message in group) */}
                      {!isGrouped && (
                        <div className="flex items-baseline mb-1">
                          <span className={`font-semibold mr-2 text-base ${getRoleColor(role)} hover:underline cursor-pointer`}>
                            {username}
                          </span>
                          {getRoleIcon(role)}
                          <span className="text-xs text-gray-500 ml-2 font-medium">
                            {messageTime ? formatDistanceToNow(new Date(messageTime), { addSuffix: true }) : 'Unknown time'}
                          </span>
                        </div>
                      )}
                      
                      {/* ✅ Message Content */}
                      <div className="text-gray-200 text-sm md:text-base leading-relaxed break-words">
                        {messageText}
                      </div>
                      
                      {/* ✅ Message Reactions */}
                      {msgReactions.length > 0 && (
                        <div className="mt-2">
                          <MessageReactions
                            reactions={msgReactions}
                            onReactionClick={(emoji, userReacted) => handleReactionClick(_id, emoji, userReacted)}
                            currentUserId={user?._id}
                          />
                        </div>
                      )}
                    </div>

                    {/* ✅ Message Actions */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-2 flex items-center space-x-1">
                      <button
                        onClick={() => setShowEmojiPicker(showEmojiPicker === _id ? null : _id)}
                        className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-600/60 rounded-lg transition-colors duration-200"
                        title="Add reaction"
                      >
                        <Plus size={16} />
                      </button>
                      
                      {showEmojiPicker === _id && (
                        <div className="absolute right-0 top-0 z-20">
                          <EmojiPicker
                            onEmojiSelect={(emoji) => handleEmojiSelect(_id, emoji)}
                            onClose={() => setShowEmojiPicker(null)}
                            position="left"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Floating Scroll to Bottom Button */}
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
