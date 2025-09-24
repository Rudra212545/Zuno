// utils/socket.js (Frontend)
import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.currentTextChannel = null;
    this.currentVoiceChannel = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  // Initialize and connect socket with authentication
  connect() {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('❌ No authentication token found');
      return null;
    }

    if (this.socket?.connected) {
      console.log('✅ Socket already connected');
      return this.socket;
    }

    console.log('🔄 Connecting to socket server...');

    this.socket = io('http://localhost:3000', {
      auth: { token }, // ✅ Send JWT token for authentication
      withCredentials: true,
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: this.maxReconnectAttempts
    });

    this.setupEventListeners();
    return this.socket;
  }

  // Setup all socket event listeners
  setupEventListeners() {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      console.log('✅ Socket connected successfully');
      this.isConnected = true;
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      this.isConnected = false;
      
      if (reason === 'io server disconnect') {
        // Server initiated disconnect, try to reconnect
        console.log('🔄 Attempting to reconnect...');
        setTimeout(() => {
          if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            this.connect();
          }
        }, 2000);
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error.message);
      
      if (error.message === 'Authentication failed' || error.message === 'Authentication token required') {
        console.log('🔑 Authentication failed, redirecting to login...');
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    });

    // Generic error handler
    this.socket.on('error', (error) => {
      console.error('❌ Socket error:', error);
    });
  }

  // Text Channel Methods
  joinTextChannel(channelId) {
    if (!this.socket || !channelId) return;

    console.log(`📥 Joining text channel: ${channelId}`);
    this.currentTextChannel = channelId;
    this.socket.emit('joinChannel', { channelId });
  }

  sendMessage(channelId, message, messageType = 'text') {
    if (!this.socket || !channelId || !message?.trim()) return;

    console.log(`💬 Sending message to channel: ${channelId}`);
    this.socket.emit('chatMessage', {
      channelId,
      message: message.trim(),
      messageType
    });
  }

  sendTypingIndicator(channelId, isTyping) {
    if (!this.socket || !channelId) return;

    this.socket.emit('typing', { channelId, isTyping });
  }

  // Voice Channel Methods
  joinVoiceChannel(channelId, userId) {
    if (!this.socket || !channelId) return;

    console.log(`🎤 Joining voice channel: ${channelId}`);
    this.currentVoiceChannel = channelId;
    this.socket.emit('joinVoiceChannel', { channelId, userId });
  }

  leaveVoiceChannel(channelId) {
    if (!this.socket || !channelId) return;

    console.log(`🎤 Leaving voice channel: ${channelId}`);
    this.currentVoiceChannel = null;
    this.socket.emit('leaveVoiceChannel', { channelId });
  }

  // WebRTC Signaling Methods
  sendOffer(offer, to, channelId) {
    if (!this.socket) return;
    
    this.socket.emit('send-offer', { 
      offer, 
      to, 
      from: this.socket.id, 
      channelId 
    });
  }

  sendAnswer(answer, to, channelId) {
    if (!this.socket) return;
    
    this.socket.emit('send-answer', { 
      answer, 
      to, 
      from: this.socket.id, 
      channelId 
    });
  }

  sendIceCandidate(candidate, to, channelId) {
    if (!this.socket) return;
    
    this.socket.emit('send-ice-candidate', { 
      candidate, 
      to, 
      channelId 
    });
  }

  // User Status Methods
  updateUserStatus(status) {
    if (!this.socket) return;
    
    this.socket.emit('updateStatus', { status });
  }

  // Event Listener Registration Methods
  onMessage(callback) {
    if (!this.socket) return;
    this.socket.on('chatMessage', callback);
  }

   sendTypingIndicator(channelId, isTyping) {
    if (!this.socket || !channelId) return;
    
    console.log(`✏️ Sending typing indicator: ${isTyping ? 'started' : 'stopped'} typing in ${channelId}`);
    this.socket.emit('typing', { channelId, isTyping });
  }

  onUserTyping(callback) {
    if (!this.socket) return;
    this.socket.on('userTyping', (data) => {
      console.log('✏️ User typing event received:', data);
      callback(data);
    });
  }

  onRecentMessages(callback) {
    if (!this.socket) return;
    this.socket.on('recentMessages', callback);
  }

  onUserJoinedChannel(callback) {
    if (!this.socket) return;
    this.socket.on('userJoinedChannel', callback);
  }

  onUserLeftChannel(callback) {
    if (!this.socket) return;
    this.socket.on('userLeftChannel', callback);
  }

  onChannelUsers(callback) {
    if (!this.socket) return;
    this.socket.on('channelUsers', callback);
  }

  onUserTyping(callback) {
    if (!this.socket) return;
    this.socket.on('userTyping', callback);
  }

  onUserStatusUpdate(callback) {
    if (!this.socket) return;
    this.socket.on('userStatusUpdate', callback);
  }

  // Voice/Video Event Listeners
  onUserJoinedVoice(callback) {
    if (!this.socket) return;
    this.socket.on('user-joined', callback);
  }

  onUserLeftVoice(callback) {
    if (!this.socket) return;
    this.socket.on('user-left', callback);
  }

  onVoiceChannelUsers(callback) {
    if (!this.socket) return;
    this.socket.on('voiceChannelUsers', callback);
  }

  // WebRTC Event Listeners
  onReceiveOffer(callback) {
    if (!this.socket) return;
    this.socket.on('receive-offer', callback);
  }

  onReceiveAnswer(callback) {
    if (!this.socket) return;
    this.socket.on('receive-answer', callback);
  }

  onReceiveIceCandidate(callback) {
    if (!this.socket) return;
    this.socket.on('receive-ice-candidate', callback);
  }

  // Remove specific event listeners
  off(event, callback) {
    if (!this.socket) return;
    this.socket.off(event, callback);
  }

  // Remove all listeners for an event
  removeAllListeners(event) {
    if (!this.socket) return;
    this.socket.removeAllListeners(event);
  }

  // Disconnect socket
  disconnect() {
    if (this.socket) {
      console.log('🔌 Disconnecting socket...');
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.currentTextChannel = null;
      this.currentVoiceChannel = null;
    }
  }

  // Reconnect with new token
  reconnectWithToken() {
    this.disconnect();
    return this.connect();
  }

  // Get connection status
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      socketId: this.socket?.id,
      currentTextChannel: this.currentTextChannel,
      currentVoiceChannel: this.currentVoiceChannel
    };
  }
}

// Create and export singleton instance
const socketService = new SocketService();
export default socketService;

// Also export the socket instance for backward compatibility
export const socket = socketService.socket;
