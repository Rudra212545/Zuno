import React, { useState, useRef, useEffect } from 'react';
import TopNavigation from '../components/homepage/TopNavigation';
import MobileMenus from '../components/homepage/MobileMenus';
import ServersSidebar from '../components/homepage/ServersSidebar';
import ChannelsSidebar from '../components/homepage/ChannelsSidebar';
import ChatArea from '../components/homepage/ChatArea';
import LogoutModal from '../components/homepage/LogoutModal';
import AddServerModal from '../components/homepage/AddServerModal';
import { useNavigate } from "react-router-dom";
import axios from 'axios';


function Homepage() {
  const navigate = useNavigate();
  const [currentChannel, setCurrentChannel] = useState('general');
  const [messageInput, setMessageInput] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showChannels, setShowChannels] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showAddServerModal, setShowAddServerModal] = useState(false);
  const [selectedServer, setSelectedServer] = useState(null);
  const [isDirectMessagesSelected, setIsDirectMessagesSelected] =useState(true);

  const profileMenuRef = useRef(null);
  const notificationsRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const logoutConfirmRef = useRef(null);

  const [servers, setServers] = useState([]);
  useEffect(() => {
    const fetchServers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error("No auth token found");
          return;
        }
  
        const response = await axios.get('http://localhost:3000/api/v1/server/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        console.log('API servers response:', response.data);
        // Adjust here depending on response shape
        setServers(Array.isArray(response.data) ? response.data : response.data.servers || []);
      } catch (error) {
        console.error("Failed to fetch servers", error);
      }
    };
  
    fetchServers();
  }, []);
  

  const handleCreateServer = (serverData) => {
    // console.log('Server created successfully:', serverData);
  
    setServers(prev => {
      const updated = [...prev, serverData];
      // console.log('Updated servers list:', updated);
      return updated;
    });
  };
  
  const notifications = [
    {
      id: 1,
      type: 'friend_request',
      user: 'Alex_Developer',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg',
      message: 'sent you a friend request',
      time: '2 minutes ago',
      unread: true
    },

  ];

  const unreadNotifications = notifications.filter(n => n.unread).length;

  const textChannels = [
    { id: 1, name: 'general', type: 'text' },
    { id: 2, name: 'announcements', type: 'text', unread: 2 },
    { id: 3, name: 'random', type: 'text', unread: 5 },
    { id: 4, name: 'dev-updates', type: 'text' },
    { id: 5, name: 'design-review', type: 'text', unread: 1 },
    { id: 6, name: 'bug-reports', type: 'text' }
  ];

  const voiceChannels = [
    { id: 5, name: 'General Voice', type: 'voice' },
    { id: 6, name: 'Dev Standup', type: 'voice', users: ['Sarah_Dev', 'Mike_Design'] },
    { id: 7, name: 'Focus Room', type: 'voice' },
    { id: 8, name: 'Music Lounge', type: 'voice', users: ['Alex_PM'] }
  ];

  const [messages, setMessages] = useState([
    {
      id: 1,
      user: 'Sarah_Dev',
      content: 'Hey everyone! Just pushed the new feature to staging 🚀',
      timestamp: 'Today at 2:42 PM',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
      role: 'admin'
    },
    {
      id: 2,
      user: 'Mike_Design',
      content: 'Looks absolutely amazing! 🎨',
      timestamp: 'Today at 2:45 PM',
      avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg',
      role: 'moderator'
    },
    {
      id: 3,
      user: 'Alex_PM',
      content: 'Perfect timing for client meeting 📅',
      timestamp: 'Today at 2:48 PM',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg',
      role: 'member'
    },
    {
      id: 4,
      user: 'Emma_QA',
      content: 'Running test cases 🧪 So far so good!',
      timestamp: 'Today at 2:52 PM',
      avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg',
      role: 'member'
    },
    {
      id: 5,
      user: 'DevBot',
      content: '🤖 Deployment to production completed. Build #247 is live.',
      timestamp: 'Today at 3:15 PM',
      avatar: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg',
      role: 'bot'
    }
  ]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageInput.trim()) {
      const newMessage = {
        id: messages.length + 1,
        user: 'You',
        content: messageInput,
        timestamp: 'Today at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
        role: 'member'
      };
      setMessages([...messages, newMessage]);
      setMessageInput('');
    }
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
    setShowProfileMenu(false);
  };

  const confirmLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    sessionStorage.clear();
    setIsLoggedIn(false);
    setShowLogoutConfirm(false);
    navigate("/login");
    setIsLoggedIn(true);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setShowMobileMenu(false);
      }
      if (logoutConfirmRef.current && !logoutConfirmRef.current.contains(event.target)) {
        setShowLogoutConfirm(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowMobileMenu(false);
        setShowChannels(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isLoggedIn) {
    return <LogoutScreen setIsLoggedIn={setIsLoggedIn} />;
  }

  // Called when a server is clicked
const handleSelectServer = (server) => {
  setSelectedServer(server);
  setIsDirectMessagesSelected(false); // Unselect direct messages
};

// Called when Direct Messages is clicked
const handleSelectDirectMessages = () => {
  setSelectedServer(null);
  setIsDirectMessagesSelected(true);
};

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white overflow-hidden">
      <TopNavigation
        selectedServer={selectedServer}
        isDirectMessagesSelected={isDirectMessagesSelected}
        onSelectDirectMessages={handleSelectDirectMessages} 
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        showProfileMenu={showProfileMenu}
        setShowProfileMenu={setShowProfileMenu}
        showMobileMenu={showMobileMenu}
        setShowMobileMenu={setShowMobileMenu}
        showChannels={showChannels}
        setShowChannels={setShowChannels}
        notifications={notifications}
        unreadNotifications={unreadNotifications}
        notificationsRef={notificationsRef}
        profileMenuRef={profileMenuRef}
        handleLogout={handleLogout}
      />

      <MobileMenus
        showMobileMenu={showMobileMenu}
        setShowMobileMenu={setShowMobileMenu}
        showChannels={showChannels}
        setShowChannels={setShowChannels}
        servers={servers}
        textChannels={textChannels}
        voiceChannels={voiceChannels}
        currentChannel={currentChannel}
        setCurrentChannel={setCurrentChannel}
        mobileMenuRef={mobileMenuRef}
      />

      <ServersSidebar
        servers={servers}
        onOpenAddServer={() => setShowAddServerModal(true)}
        onSelectServer={handleSelectServer}        // updated handler
        onSelectDirectMessages={handleSelectDirectMessages}  // new prop
      />


      <ChannelsSidebar
        currentChannel={currentChannel}
        setCurrentChannel={setCurrentChannel}
        textChannels={textChannels}
        voiceChannels={voiceChannels}
      />

      <ChatArea
        currentChannel={currentChannel}
        messages={messages}
        messageInput={messageInput}
        setMessageInput={setMessageInput}
        handleSendMessage={handleSendMessage}
      />

      <LogoutModal
        showLogoutConfirm={showLogoutConfirm}
        confirmLogout={confirmLogout}
        cancelLogout={cancelLogout}
        logoutConfirmRef={logoutConfirmRef}
      />

      <AddServerModal
        isOpen={showAddServerModal}
        onClose={() => setShowAddServerModal(false)}
        onCreate={handleCreateServer}
      />
    </div>
  );
}

export default Homepage;
