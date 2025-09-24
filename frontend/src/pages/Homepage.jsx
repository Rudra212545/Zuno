import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from 'react-router-dom';

import TopNavigation from "../components/homepage/TopNavigation";
import MobileMenus from "../components/homepage/MobileMenus";
import ServersSidebar from "../components/homepage/ServersSidebar";
import ChannelsSidebar from "../components/homepage/ChannelsSidebar";
import ChatArea from "../components/homepage/ChatArea";
import LogoutModal from "../components/homepage/LogoutModal";
import AddServerModal from "../components/homepage/AddServerModal";
import AddChannelForm from "../components/homepage/AddChannelForm";
import InvitePeopleModal from "../components/homepage/invitePeopleModal";
import OnlineUsers from "../components/homepage/OnlineUsers";

import socketService from '../utils/socket';
import { sendMessage } from "../api/messageApi";

// Redux slices
import { setUser } from "../store/slices/userSlice";
import { setServers, selectServer, addServer } from "../store/slices/serverSlice";
import { setChannels, setCurrentChannel, setCurrentChannelId, addChannel } from "../store/slices/channelSlice";
import { setMessages, addMessage } from "../store/slices/messageSlice";
import { set } from "../store/slices/uiSlice";

function Homepage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();


  const [channelUsers, setChannelUsers] = useState([]);
  const [showOnlineUsers, setShowOnlineUsers] = useState(false);

  // Redux state selectors
  const {
    currentChannel,
    currentChannelId,
    channels
  } = useSelector((state) => state.channel);

  const {
    user,
    token
  } = useSelector((state) => state.user);

  const {
    servers,
    selectedServer
  } = useSelector((state) => state.server);

  const {
    messages
  } = useSelector((state) => state.message);

  const ui = useSelector((state) => state.ui);

  // Refs for click outside detection
  const profileMenuRef = useRef(null);
  const notificationsRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const logoutConfirmRef = useRef(null);

  // Sample notifications
  const notifications = [
    {
      id: 1,
      type: "friend_request", 
      user: "Alex_Developer",
      avatar: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg",
      message: "sent you a friend request",
      time: "2 minutes ago",
      unread: true,
    },
  ];
  const unreadNotifications = notifications.filter((n) => n.unread).length;

  // ✅ FIXED: Single unified socket setup
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !user) return;

    console.log('🔄 Setting up socket connection for:', user.username);
    
    const socket = socketService.connect();
    
    if (socket) {
      // ✅ FIXED: Enhanced message listener
    socketService.onMessage((messageData) => {
      console.log('📨 RAW MESSAGE RECEIVED from socket:', messageData);
      
      const normalizedMessage = {
        _id: messageData._id,
        content: messageData.message || messageData.content,
        message: messageData.message || messageData.content,
        channelId: messageData.channelId,
        channel: { _id: messageData.channelId },
        author: messageData.author,
        sender: messageData.sender || messageData.author,
        createdAt: messageData.createdAt,
        timestamp: messageData.timestamp || messageData.createdAt
      };
      
      console.log('✅ NORMALIZED MESSAGE for Redux:', normalizedMessage);
      dispatch(addMessage(normalizedMessage));
    });


        // ✅ FIXED: Recent messages listener with proper debugging
    socketService.onRecentMessages((data) => {
      console.log('📜 RECENT MESSAGES RAW DATA:', data);
      
      // Check the structure of the received data
      if (data && typeof data === 'object') {
        console.log('📜 Recent messages structure:', {
          hasChannelId: !!data.channelId,
          hasMessages: !!data.messages,
          messagesType: Array.isArray(data.messages),
          messagesCount: data.messages ? data.messages.length : 0,
          currentChannelId: currentChannelId
        });
        
        const { channelId, messages } = data;
        
        if (!messages || !Array.isArray(messages)) {
          console.log('❌ Invalid messages array received:', messages);
          return;
        }
        
        if (channelId !== currentChannelId) {
          console.log('❌ Channel mismatch:', {
            received: channelId,
            current: currentChannelId
          });
          return;
        }
        
        // ✅ Normalize all recent messages
        console.log('🔄 Normalizing', messages.length, 'recent messages...');
        const normalizedMessages = messages.map((msg, index) => {
          const normalized = {
            _id: msg._id,
            content: msg.content || msg.message,
            message: msg.content || msg.message,
            channelId: msg.channelId || channelId,
            channel: { _id: msg.channelId || channelId },
            author: msg.author,
            sender: msg.author,
            createdAt: msg.createdAt,
            timestamp: msg.createdAt,
            reactions: msg.reactions || []
          };
          
          if (index < 3) { // Debug first 3 messages
            console.log(`📋 Recent message ${index + 1}:`, {
              id: normalized._id,
              content: normalized.content,
              author: normalized.author?.username
            });
          }
          
          return normalized;
        });
        
        console.log('✅ Setting', normalizedMessages.length, 'messages in Redux');
        dispatch(setMessages(normalizedMessages));
        
      } else {
        console.log('❌ Invalid recent messages data received:', data);
      }
    });


      // User presence listeners
      socketService.onUserJoinedChannel((userData) => {
        console.log('👋 User joined:', userData);
      });

      socketService.onUserLeftChannel((userData) => {
        console.log('👋 User left:', userData);
      });

      // Typing indicators
      socketService.onUserTyping(({ userId, username, isTyping, channelId }) => {
        if (channelId === currentChannelId && userId !== user._id) {
          console.log(`✏️ ${username} ${isTyping ? 'typing' : 'stopped typing'}`);
        }
      });
    }

    // ✅ Proper cleanup
    return () => {
      console.log('🔄 Cleaning up socket listeners');
      if (socketService.socket) {
        socketService.socket.off('chatMessage');
        socketService.socket.off('recentMessages');
        socketService.socket.off('userJoinedChannel');
        socketService.socket.off('userLeftChannel');
        socketService.socket.off('userTyping');
      }
    };
  }, [token, user?.username, dispatch, currentChannelId]);

  // ✅ FIXED: Only join channel via socket, no API conflicts
  useEffect(() => {
    if (currentChannelId && user && socketService.getConnectionStatus().isConnected) {
      console.log('🔄 Joining channel:', currentChannelId);
      socketService.joinTextChannel(currentChannelId);
    }
  }, [currentChannelId, user]);

  // Fetch user & servers
  useEffect(() => {
    if (!token) {
      console.warn("No token found.");
      return;
    }

    const fetchData = async () => {
      try {
        const [userRes, serverRes] = await Promise.all([
          axios.get("http://localhost:3000/api/v1/users/avatar", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:3000/api/v1/server/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        dispatch(setUser(userRes.data));

        const serversData = Array.isArray(serverRes.data)
          ? serverRes.data
          : serverRes.data.servers || [];

        dispatch(setServers(serversData));
        dispatch(selectServer(null));
        dispatch(setChannels([]));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [token, dispatch]);

  // Handle forced refresh after joining server
  useEffect(() => {
    const state = location.state;
    
    if (state?.justJoined && state?.forceRefresh) {
      console.log('🎉 User just joined server, forcing UI refresh...');
      
      const forceRefreshServers = async () => {
        try {
          if (!token) return;

          console.log('🔄 Force refreshing servers...');
          
          for (let i = 0; i < 3; i++) {
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
            
            const serverRes = await axios.get("http://localhost:3000/api/v1/server/", {
              headers: { Authorization: `Bearer ${token}` },
            });

            let serversData = [];
            if (Array.isArray(serverRes.data)) {
              serversData = serverRes.data;
            } else if (serverRes.data.data) {
              serversData = serverRes.data.data;
            } else if (serverRes.data.servers) {
              serversData = serverRes.data.servers;
            }

            console.log(`🔄 Refresh attempt ${i + 1}:`, serversData.length, 'servers');
            dispatch(setServers(serversData));
            
            if (state.newServerId) {
              const newServer = serversData.find(s => s._id === state.newServerId);
              if (newServer) {
                console.log('✅ Auto-selecting server:', newServer.name);
                handleSelectServer(newServer);
                break;
              }
            }
          }
        } catch (error) {
          console.error('❌ Error in force refresh:', error);
        }
      };

      forceRefreshServers();
      window.history.replaceState({}, document.title);
    }
  }, [location.state, token, dispatch]);

  // Enhanced message sending
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!ui.messageInput?.trim() || !currentChannelId) {
      console.log('❌ Message validation failed:', {
        hasMessage: !!ui.messageInput?.trim(),
        hasChannelId: !!currentChannelId,
        messageInput: ui.messageInput,
        currentChannelId
      });
      return;
    }

    console.log('🔄 Sending message:', {
      message: ui.messageInput,
      channelId: currentChannelId,
      user: user?.username,
      socketConnected: socketService.getConnectionStatus().isConnected
    });

    try {
      socketService.sendMessage(currentChannelId, ui.messageInput);
      dispatch(set({ key: "messageInput", value: "" }));
      console.log('✅ Message sent via socket');
    } catch (error) {
      console.error("❌ Socket send failed:", error);
      
      try {
        console.log('🔄 Trying API fallback...');
        const savedMessage = await sendMessage(currentChannelId, ui.messageInput, token);
        dispatch(addMessage(savedMessage));
        dispatch(set({ key: "messageInput", value: "" }));
        console.log('✅ Message sent via API fallback');
      } catch (apiError) {
        console.error("❌ Both methods failed:", apiError);
        alert('Failed to send message. Please try again.');
      }
    }
  };

  // Select server
  const handleSelectServer = async (server) => {
    dispatch(selectServer(server));
    dispatch(set({ key: "isDirectMessagesSelected", value: false }));

    if (!token) return;

    try {
      const channelsRes = await axios.get(
        `http://localhost:3000/api/v1/server/${server._id}/channels`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      dispatch(setChannels(channelsRes.data));

      if (channelsRes.data.length > 0) {
        const firstTextChannel = channelsRes.data.find(ch => ch.type === 'text') || channelsRes.data[0];
        dispatch(setCurrentChannelId(firstTextChannel._id));
        dispatch(setCurrentChannel(firstTextChannel.name));
        console.log('✅ Auto-selected channel:', firstTextChannel.name);
      } else {
        dispatch(setCurrentChannelId(null));
        dispatch(setCurrentChannel(null));
      }
    } catch (error) {
      console.error("Error fetching channels:", error);
      dispatch(setChannels([]));
      dispatch(setCurrentChannelId(null));
    }
  };

  // Direct messages
  const handleSelectDirectMessages = () => {
    dispatch(selectServer(null));
    dispatch(set({ key: "isDirectMessagesSelected", value: true }));
    dispatch(setChannels([]));
    dispatch(setCurrentChannelId(null));
  };

  // Logout
  const handleLogout = () => {
    dispatch(set({ key: "showLogoutConfirm", value: true }));
    dispatch(set({ key: "showProfileMenu", value: false }));
  };

  const confirmLogout = () => {
    dispatch(set({ key: "isLoggingOut", value: true }));

    setTimeout(() => {
      socketService.disconnect(); // ✅ Disconnect socket on logout
      dispatch(setUser(null));
      localStorage.clear();
      sessionStorage.clear();
      dispatch(set({ key: "showLogoutConfirm", value: false }));
      dispatch(set({ key: "isLoggingOut", value: false }));
      navigate("/login");
    }, 1000);
  };

  const cancelLogout = () => {
    dispatch(set({ key: "showLogoutConfirm", value: false }));
  };

  // Outside click handling
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        dispatch(set({ key: "showProfileMenu", value: false }));
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        dispatch(set({ key: "showNotifications", value: false }));
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        dispatch(set({ key: "showMobileMenu", value: false }));
      }
      if (logoutConfirmRef.current && !logoutConfirmRef.current.contains(event.target)) {
        dispatch(set({ key: "showLogoutConfirm", value: false }));
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dispatch]);

  // Responsive handling
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        dispatch(set({ key: "showMobileMenu", value: false }));
        dispatch(set({ key: "showChannels", value: false }));
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);

  // Create server
  const handleCreateServer = (serverData) => {
    dispatch(addServer(serverData));
  };

  const handleCreateChannel = (newChannel) => {
    console.log('🔄 handleCreateChannel called with:', newChannel);
    dispatch(addChannel(newChannel));
    dispatch(set({ key: "showCreateChannelForm", value: false }));
    
    if (newChannel && newChannel._id) {
      dispatch(setCurrentChannelId(newChannel._id));
      dispatch(setCurrentChannel(newChannel.name));
    }
  };

  // Debug channels
  useEffect(() => {
    console.log('🔍 Channels updated:', channels?.length || 0);
  }, [channels]);

  // ✅ Set up channel users listener
  useEffect(() => {
    const handleChannelUsers = ({ channelId, users }) => {
      if (channelId === currentChannelId) {
        console.log('👥 Channel users updated:', users);
        setChannelUsers(users);
      }
    };

    const handleUserJoined = (userData) => {
      console.log('👋 User joined channel:', userData);
      if (userData.channelId === currentChannelId) {
        setChannelUsers(prev => {
          const exists = prev.find(u => u.userId === userData.userId);
          if (!exists) {
            return [...prev, {
              userId: userData.userId,
              username: userData.username,
              avatar: userData.avatar,
              isOnline: true
            }];
          }
          return prev;
        });
      }
    };

    const handleUserLeft = (userData) => {
      console.log('👋 User left channel:', userData);
      if (userData.channelId === currentChannelId) {
        setChannelUsers(prev => prev.filter(u => u.userId !== userData.userId));
      }
    };

    if (socketService.socket) {
      socketService.socket.on('channelUsers', handleChannelUsers);
      socketService.socket.on('userJoinedChannel', handleUserJoined);
      socketService.socket.on('userLeftChannel', handleUserLeft);
    }

    return () => {
      if (socketService.socket) {
        socketService.socket.off('channelUsers', handleChannelUsers);
        socketService.socket.off('userJoinedChannel', handleUserJoined);
        socketService.socket.off('userLeftChannel', handleUserLeft);
      }
    };
  }, [currentChannelId]);

  // Clear channel users when changing channels
  useEffect(() => {
    setChannelUsers([]);
  }, [currentChannelId]);

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white overflow-hidden">
      <TopNavigation
        user={user}
        selectedServer={selectedServer}
        isDirectMessagesSelected={ui.isDirectMessagesSelected}
        onSelectDirectMessages={handleSelectDirectMessages}
        showNotifications={ui.showNotifications}
        setShowNotifications={(val) => dispatch(set({ key: "showNotifications", value: val }))}
        showProfileMenu={ui.showProfileMenu}
        setShowProfileMenu={(val) => dispatch(set({ key: "showProfileMenu", value: val }))}
        showMobileMenu={ui.showMobileMenu}
        setShowMobileMenu={(val) => dispatch(set({ key: "showMobileMenu", value: val }))}
        showChannels={ui.showChannels}
        setShowChannels={(val) => dispatch(set({ key: "showChannels", value: val }))}
        notifications={notifications}
        unreadNotifications={unreadNotifications}
        notificationsRef={notificationsRef}
        profileMenuRef={profileMenuRef}
        handleLogout={handleLogout}
      />

      <MobileMenus
        showMobileMenu={ui.showMobileMenu}
        setShowMobileMenu={(val) => dispatch(set({ key: "showMobileMenu", value: val }))}
        showChannels={ui.showChannels}
        setShowChannels={(val) => dispatch(set({ key: "showChannels", value: val }))}
        servers={servers}
        currentChannel={currentChannel}
        setCurrentChannel={(val) => dispatch(setCurrentChannel(val))}
        mobileMenuRef={mobileMenuRef}
        user={user}
        selectedServer={selectedServer}
        channels={channels}
      />

      <ServersSidebar
        servers={servers}
        onOpenAddServer={() => dispatch(set({ key: "showAddServerModal", value: true }))}
        onSelectServer={handleSelectServer}
        onSelectDirectMessages={handleSelectDirectMessages}
      />

      <ChannelsSidebar
        currentChannel={currentChannel}
        setCurrentChannel={(val) => dispatch(setCurrentChannel(val))}
        setCurrentChannelId={(val) => dispatch(setCurrentChannelId(val))}
        setCallActive={(val) => dispatch(set({ key: "callActive", value: val }))}
        setCallChannelId={(val) => dispatch(set({ key: "callChannelId", value: val }))}
        user={user}
        selectedServer={selectedServer}
        channels={channels}
        isDirectMessagesSelected={ui.isDirectMessagesSelected}
        onOpenCreateChannel={() => dispatch(set({ key: "showCreateChannelForm", value: true }))}
      />

    <ChatArea
        currentChannel={currentChannel}
        currentChannelId={currentChannelId}
        messages={messages}
        channels={channels}
        messageInput={ui.messageInput || ""}
        setMessageInput={(val) => dispatch(set({ key: "messageInput", value: val }))}
        handleSendMessage={handleSendMessage}
        callActive={ui.callActive}
        callChannelId={ui.callChannelId}
        onEndCall={() => dispatch(set({ key: "callActive", value: false }))}
      />

      {/* ✅ Online Users Panel */}
      <OnlineUsers 
        users={channelUsers}
        isOpen={showOnlineUsers}
        onToggle={() => setShowOnlineUsers(!showOnlineUsers)}
      />

      <LogoutModal
        showLogoutConfirm={ui.showLogoutConfirm}
        confirmLogout={confirmLogout}
        cancelLogout={cancelLogout}
        logoutConfirmRef={logoutConfirmRef}
        isLoggingOut={ui.isLoggingOut}
      />

      <AddServerModal
        isOpen={ui.showAddServerModal}
        onClose={() => dispatch(set({ key: "showAddServerModal", value: false }))}
        onCreate={handleCreateServer}
      />

      {ui.showCreateChannelForm && (
        <AddChannelForm
          serverId={selectedServer?._id}
          userId={user?._id}
          onClose={() => dispatch(set({ key: "showCreateChannelForm", value: false }))}
          onCreate={handleCreateChannel}
        />
      )}

      {ui.showInvitePeopleModal && (
        <InvitePeopleModal
          isOpen={ui.showInvitePeopleModal}
          onClose={() => dispatch(set({ key: "showInvitePeopleModal", value: false }))}
          server={selectedServer}
          user={user}
        />
      )}
    </div>
  );
}

export default Homepage;
