import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

import TopNavigation from "../components/homepage/TopNavigation";
import MobileMenus from "../components/homepage/MobileMenus";
import ServersSidebar from "../components/homepage/ServersSidebar";
import ChannelsSidebar from "../components/homepage/ChannelsSidebar";
import ChatArea from "../components/homepage/ChatArea";
import LogoutModal from "../components/homepage/LogoutModal";
import AddServerModal from "../components/homepage/AddServerModal";
import AddChannelForm from "../components/homepage/AddChannelForm";

import socket from "../utils/socket";
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

  // Sample notifications (replace with real)
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

  // Socket join/leave for messages
  useEffect(() => {
    if (!currentChannel) return;

    socket.emit("joinRoom", currentChannel);

    socket.on("receiveMessage", (message) => {
      dispatch(addMessage(message));
    });

    return () => {
      socket.emit("leaveRoom", currentChannel);
      socket.off("receiveMessage");
    };
  }, [currentChannel, dispatch]);

  // Fetch messages when channel changes
  useEffect(() => {
    if (!currentChannelId || !selectedServer || !user) return;
    if (!token) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/v1/messages/${currentChannelId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        dispatch(setMessages(res.data));
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [currentChannelId, selectedServer, user, token, dispatch]);

  // Send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!ui.messageInput?.trim()) return;

    try {
      const savedMessage = await sendMessage(currentChannelId, ui.messageInput, token);
      socket.emit("sendMessage", savedMessage);
      dispatch(addMessage(savedMessage));
      dispatch(set({ key: "messageInput", value: "" }));
    } catch (error) {
      console.error("Error sending message:", error);
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
        dispatch(setCurrentChannelId(channelsRes.data[0]._id));
      } else {
        dispatch(setCurrentChannelId(null));
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

  // Outside click close
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

  // Responsive reset
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
          onCreate={(newChannel) => dispatch(addChannel(newChannel))}
        />
      )}
    </div>
  );
}

export default Homepage;
