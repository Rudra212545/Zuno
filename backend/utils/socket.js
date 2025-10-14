import { Server } from "socket.io";
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import Message from '../models/message.model.js';

let io;
const userSocketMap = new Map(); // userId -> socketId
const channelUsers = new Map(); // channelId -> Set of userIds
const socketUserMap = new Map(); // socketId -> userId

export function initChatSocket(server) {
  console.log('🔄 Setting up Socket.IO server...');
  
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  console.log('🔄 Setting up authentication middleware...');


  io.use(async (socket, next) => {
    console.log('🔍 Socket auth middleware triggered for:', socket.id);
    
    try {
      const token = socket.handshake.auth.token;
      console.log('🔑 Socket auth debug:', {
        hasToken: !!token,
        tokenLength: token?.length,
        tokenStart: token?.substring(0, 20) + '...'
      });

      if (!token) {
        console.log('❌ No token provided in socket auth');
        return next(new Error('Authentication token required'));
      }

      if (!process.env.ACCESS_TOKEN_SECRET) {
        console.log('❌ ACCESS_TOKEN_SECRET not found in environment');
        return next(new Error('Server configuration error'));
      }

      console.log('🔍 Verifying JWT token...');
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      console.log('✅ JWT decoded:', {
        userId: decoded._id,
        email: decoded.email
      });
      
      const user = await User.findById(decoded._id).select('-password');
      
      if (!user) {
        console.log('❌ User not found for ID:', decoded._id);
        return next(new Error('Invalid user'));
      }
      
      socket.userId = user._id.toString();
      socket.username = user.username;
      socket.email = user.email;
      socket.avatar = user.avatar?.url;
      
      console.log('✅ Socket authenticated successfully:', {
        socketId: socket.id,
        userId: socket.userId,
        username: socket.username,
        email: socket.email
      });
      
      next();
    } catch (error) {
      console.error('❌ Socket authentication error:', error.message);
      console.error('❌ Full error:', error);
      next(new Error(`Authentication failed: ${error.message}`));
    }
  });

  console.log('🔄 Setting up connection handler...');

  io.on("connection", (socket) => {
    console.log(`✅ User successfully connected and authenticated:`);
    console.log(`   - Socket ID: ${socket.id}`);
    console.log(`   - Username: ${socket.username || 'NOT SET'}`);
    console.log(`   - User ID: ${socket.userId || 'NOT SET'}`);
    console.log(`   - Email: ${socket.email || 'NOT SET'}`);

    if (!socket.userId || !socket.username) {
      console.log('❌ Socket connected but not authenticated properly, disconnecting...');
      socket.disconnect();
      return;
    }

    userSocketMap.set(socket.userId, socket.id);
    socketUserMap.set(socket.id, socket.userId);
    updateUserStatus(socket.userId, 'online');

    console.log('🔄 Setting up event handlers for authenticated user:', socket.username);

    // ✅ Enhanced Chat functionality
    socket.on("joinChannel", async ({ channelId }) => {
      try {
        console.log(`📥 ${socket.username} (${socket.userId}) joining text channel: ${channelId}`);
        
        const currentRooms = Array.from(socket.rooms);
        currentRooms.forEach(room => {
          if (room !== socket.id && room.startsWith('text_')) {
            socket.leave(room);
            const oldChannelId = room.replace('text_', '');
            removeUserFromChannel(oldChannelId, socket.userId);
            
            socket.to(room).emit('userLeftChannel', {
              userId: socket.userId,
              username: socket.username,
              channelId: oldChannelId,
              channelType: 'text'
            });
          }
        });

        const roomName = `text_${channelId}`;
        socket.join(roomName);
        addUserToChannel(channelId, socket.userId);

        console.log(`✅ ${socket.username} joined room: ${roomName}`);

        const room = io.sockets.adapter.rooms.get(roomName);
        const roomSize = room?.size || 0;
        console.log(`📊 Room ${roomName} now has ${roomSize} members`);

        socket.to(roomName).emit('userJoinedChannel', {
          userId: socket.userId,
          username: socket.username,
          avatar: socket.avatar,
          channelId,
          channelType: 'text'
        });

        const channelUsersList = await getChannelUsers(channelId);
        socket.emit('channelUsers', {
          channelId,
          users: channelUsersList,
          channelType: 'text'
        });

        try {
          const recentMessages = await Message.find({ channel: channelId })
            .populate('author', 'username avatar email')
            .sort({ createdAt: -1 })
            .limit(50);

          const formattedMessages = recentMessages.reverse().map(msg => ({
            _id: msg._id,
            message: msg.content,
            content: msg.content,
            channelId: channelId,
            channel: { _id: channelId },
            author: msg.author,
            sender: msg.author,
            createdAt: msg.createdAt,
            timestamp: msg.createdAt,
            reactions: msg.reactions || [] // ✅ Include reactions
          }));

          socket.emit('recentMessages', {
            channelId,
            messages: formattedMessages
          });

          console.log(`📜 Sent ${formattedMessages.length} recent messages to ${socket.username}`);
        } catch (error) {
          console.error('Error fetching recent messages:', error);
        }

        console.log(`✅ ${socket.username} successfully joined text channel ${channelId}`);
      } catch (error) {
        console.error('Error joining text channel:', error);
        socket.emit('error', { message: 'Failed to join channel' });
      }
    });

    // ✅ Enhanced chat messages with proper debugging
    socket.on("chatMessage", async ({ channelId, message, messageType = 'text' }) => {
      try {
        console.log(`💬 ${socket.username} (${socket.userId}) sending message to channel ${channelId}: "${message}"`);

        if (!message?.trim()) {
          console.log('❌ Empty message rejected');
          return socket.emit('error', { message: 'Message cannot be empty' });
        }

        const roomName = `text_${channelId}`;
        const isInRoom = socket.rooms.has(roomName);
        const room = io.sockets.adapter.rooms.get(roomName);
        const roomSize = room?.size || 0;
        
        console.log('🔍 Chat message debug:', {
          roomName,
          isUserInRoom: isInRoom,
          roomSize,
          userRooms: Array.from(socket.rooms)
        });

        if (!isInRoom) {
          console.log('❌ User not in target room, joining first');
          socket.join(roomName);
        }

        const newMessage = new Message({
          content: message.trim(),
          author: socket.userId,
          channel: channelId,
          messageType,
          reactions: [] // ✅ Initialize empty reactions array
        });

        const savedMessage = await newMessage.save();
        await savedMessage.populate('author', 'username avatar email');

        console.log('✅ Message saved to database:', {
          messageId: savedMessage._id,
          content: savedMessage.content,
          author: savedMessage.author.username
        });

        const messageData = {
          _id: savedMessage._id,
          channelId,
          message: savedMessage.content,
          content: savedMessage.content,
          messageType: savedMessage.messageType,
          sender: {
            _id: savedMessage.author._id,
            userId: savedMessage.author._id,
            username: savedMessage.author.username,
            avatar: savedMessage.author.avatar,
            email: savedMessage.author.email
          },
          author: savedMessage.author,
          timestamp: savedMessage.createdAt,
          createdAt: savedMessage.createdAt,
          reactions: savedMessage.reactions || [] // ✅ Include reactions
        };

        console.log('📤 Broadcasting message to room:', roomName);

        io.to(roomName).emit("chatMessage", messageData);
        
        const updatedRoom = io.sockets.adapter.rooms.get(roomName);
        const updatedRoomSize = updatedRoom?.size || 0;
        
        console.log(`✅ Message broadcasted to ${updatedRoomSize} users in room ${roomName}`);
      } catch (error) {
        console.error('❌ Error handling chat message:', error);
        console.error('❌ Stack trace:', error.stack);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // ✅ Typing indicators
    socket.on('typing', ({ channelId, isTyping }) => {
      const roomName = `text_${channelId}`;
      socket.to(roomName).emit('userTyping', {
        userId: socket.userId,
        username: socket.username,
        isTyping,
        channelId
      });
    });

    // ✅ FIXED: Message reactions (moved inside connection handler)
    socket.on("addReaction", async ({ messageId, emoji }) => {
      try {
        console.log(`😀 ${socket.username} adding reaction ${emoji} to message ${messageId}`);

        const message = await Message.findById(messageId);
        if (!message) {
          return socket.emit('error', { message: 'Message not found' });
        }

        // Find or create reaction
        let reaction = message.reactions.find(r => r.emoji === emoji);
        
        if (reaction) {
          // Check if user already reacted
          if (reaction.users.includes(socket.userId)) {
            return socket.emit('error', { message: 'Already reacted with this emoji' });
          }
          
          // Add user to reaction
          reaction.users.push(socket.userId);
          reaction.count = reaction.users.length;
        } else {
          // Create new reaction
          reaction = {
            emoji,
            users: [socket.userId],
            count: 1
          };
          message.reactions.push(reaction);
        }

        await message.save();

        // Broadcast reaction update to channel
        const roomName = `text_${message.channel}`;
        io.to(roomName).emit("reactionAdded", {
          messageId,
          emoji,
          userId: socket.userId,
          username: socket.username,
          reaction: {
            emoji: reaction.emoji,
            count: reaction.count,
            users: reaction.users
          }
        });

        console.log(`✅ Reaction ${emoji} added to message ${messageId}`);
      } catch (error) {
        console.error('Error adding reaction:', error);
        socket.emit('error', { message: 'Failed to add reaction' });
      }
    });

    socket.on("removeReaction", async ({ messageId, emoji }) => {
      try {
        console.log(`😀 ${socket.username} removing reaction ${emoji} from message ${messageId}`);

        const message = await Message.findById(messageId);
        if (!message) {
          return socket.emit('error', { message: 'Message not found' });
        }

        const reaction = message.reactions.find(r => r.emoji === emoji);
        if (!reaction) {
          return socket.emit('error', { message: 'Reaction not found' });
        }

        // Remove user from reaction
        reaction.users = reaction.users.filter(userId => userId.toString() !== socket.userId.toString());
        reaction.count = reaction.users.length;

        // Remove reaction if no users left
        if (reaction.count === 0) {
          message.reactions = message.reactions.filter(r => r.emoji !== emoji);
        }

        await message.save();

        // Broadcast reaction removal to channel
        const roomName = `text_${message.channel}`;
        io.to(roomName).emit("reactionRemoved", {
          messageId,
          emoji,
          userId: socket.userId,
          username: socket.username,
          reaction: reaction.count > 0 ? {
            emoji: reaction.emoji,
            count: reaction.count,
            users: reaction.users
          } : null
        });

        console.log(`✅ Reaction ${emoji} removed from message ${messageId}`);
      } catch (error) {
        console.error('Error removing reaction:', error);
        socket.emit('error', { message: 'Failed to remove reaction' });
      }
    });

    // ✅ Voice/Video Call Signaling
    socket.on("joinVoiceChannel", async ({ channelId, userId }) => {
      try {
        console.log(`🎤 ${socket.username} joining voice channel: ${channelId}`);
        
        const currentRooms = Array.from(socket.rooms);
        currentRooms.forEach(room => {
          if (room !== socket.id && room.startsWith('voice_')) {
            socket.leave(room);
            const oldChannelId = room.replace('voice_', '');
            removeUserFromChannel(oldChannelId, socket.userId);
            
            socket.to(room).emit("user-left", { 
              socketId: socket.id, 
              userId: socket.userId,
              username: socket.username,
              channelId: oldChannelId
            });
          }
        });

        const voiceRoomName = `voice_${channelId}`;
        socket.join(voiceRoomName);
        addUserToChannel(channelId, socket.userId);

        const voiceUsers = await getChannelUsers(channelId);
        
        socket.to(voiceRoomName).emit("user-joined", { 
          userId: socket.userId, 
          username: socket.username,
          avatar: socket.avatar,
          socketId: socket.id,
          channelId
        });

        socket.emit('voiceChannelUsers', {
          channelId,
          users: voiceUsers
        });

        console.log(`✅ ${socket.username} joined voice channel ${channelId}`);
      } catch (error) {
        console.error('Error joining voice channel:', error);
        socket.emit('error', { message: 'Failed to join voice channel' });
      }
    });

    // WebRTC Signaling
    socket.on("send-offer", ({ offer, to, from, channelId }) => {
      console.log(`📞 Sending offer from ${socket.username} to ${to}`);
      io.to(to).emit("receive-offer", { 
        offer, 
        from: socket.id,
        fromUserId: socket.userId,
        fromUsername: socket.username,
        channelId
      });
    });

    socket.on("send-answer", ({ answer, to, from, channelId }) => {
      console.log(`📞 Sending answer from ${socket.username} to ${to}`);
      io.to(to).emit("receive-answer", { 
        answer, 
        from: socket.id,
        fromUserId: socket.userId,
        fromUsername: socket.username,
        channelId
      });
    });

    socket.on("send-ice-candidate", ({ candidate, to, channelId }) => {
      if (to && candidate) {
        io.to(to).emit("receive-ice-candidate", { 
          candidate, 
          from: socket.id,
          fromUserId: socket.userId,
          fromUsername: socket.username,
          channelId
        });
      }
    });

    socket.on("leaveVoiceChannel", ({ channelId }) => {
      console.log(`🎤 ${socket.username} leaving voice channel: ${channelId}`);
      const voiceRoomName = `voice_${channelId}`;
      socket.leave(voiceRoomName);
      removeUserFromChannel(channelId, socket.userId);
      
      socket.to(voiceRoomName).emit("user-left", { 
        socketId: socket.id,
        userId: socket.userId,
        username: socket.username,
        channelId
      });
    });

    socket.on('updateStatus', async ({ status }) => {
      try {
        await updateUserStatus(socket.userId, status);
        
        socket.rooms.forEach(room => {
          if (room !== socket.id) {
            socket.to(room).emit('userStatusUpdate', {
              userId: socket.userId,
              username: socket.username,
              status
            });
          }
        });
      } catch (error) {
        console.error('Error updating user status:', error);
      }
    });

    socket.on("disconnect", () => {
      console.log(`❌ User disconnected: ${socket.username} (${socket.id})`);

      const userId = socketUserMap.get(socket.id);
      
      socket.rooms.forEach(room => {
        if (room !== socket.id) {
          if (room.startsWith('text_')) {
            const channelId = room.replace('text_', '');
            socket.to(room).emit('userLeftChannel', {
              userId: socket.userId,
              username: socket.username,
              channelId,
              channelType: 'text'
            });
          } else if (room.startsWith('voice_')) {
            const channelId = room.replace('voice_', '');
            socket.to(room).emit("user-left", { 
              socketId: socket.id,
              userId: socket.userId,
              username: socket.username,
              channelId
            });
          }
          
          if (userId) {
            removeUserFromChannel(room.replace(/^(text_|voice_)/, ''), userId);
          }
        }
      });

      if (userId) {
        userSocketMap.delete(userId);
      }
      socketUserMap.delete(socket.id);

      setTimeout(async () => {
        if (userId && !userSocketMap.has(userId)) {
          await updateUserStatus(userId, 'offline');
        }
      }, 5000);
    });
  });

  console.log("✅ Socket.io server fully initialized with authentication");
  return io;
}

// Helper Functions
function addUserToChannel(channelId, userId) {
  if (!channelUsers.has(channelId)) {
    channelUsers.set(channelId, new Set());
  }
  channelUsers.get(channelId).add(userId);
}

function removeUserFromChannel(channelId, userId) {
  if (channelUsers.has(channelId)) {
    channelUsers.get(channelId).delete(userId);
    if (channelUsers.get(channelId).size === 0) {
      channelUsers.delete(channelId);
    }
  }
}

async function getChannelUsers(channelId) {
  if (!channelUsers.has(channelId)) return [];
  
  const userIds = Array.from(channelUsers.get(channelId));
  const users = [];
  
  for (const userId of userIds) {
    try {
      const user = await User.findById(userId).select('username avatar email status');
      const socketId = userSocketMap.get(userId);
      
      if (user) {
        users.push({
          userId,
          username: user.username,
          avatar: user.avatar?.url,
          email: user.email,
          status: user.status,
          isOnline: !!socketId,
          socketId
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }
  
  return users;
}

async function updateUserStatus(userId, status) {
  try {
    await User.findByIdAndUpdate(userId, { 
      status,
      lastSeen: new Date()
    });
  } catch (error) {
    console.error('Error updating user status:', error);
  }
}

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

export const getUserSocketId = (userId) => {
  return userSocketMap.get(userId);
};

export const getChannelUsersList = (channelId) => {
  return getChannelUsers(channelId);
};

export { io };
