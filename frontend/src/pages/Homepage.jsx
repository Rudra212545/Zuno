import React, { useState, useRef, useEffect } from 'react';
import TopNavigation from '../components/homepage/TopNavigation';
import MobileMenus from '../components/homepage/MobileMenus';
import ServersSidebar from '../components/homepage/ServersSidebar';
import ChannelsSidebar from '../components/homepage/ChannelsSidebar';
import ChatArea from '../components/homepage/ChatArea';
import LogoutModal from '../components/homepage/LogoutModal';
import AddServerModal from '../components/homepage/AddServerModal';
import AddChannelForm from '../components/homepage/AddChannelForm';
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
  const [showAddServerModal, setShowAddServerModal] = useState(false);
  const [isDirectMessagesSelected, setIsDirectMessagesSelected] =useState(true);
  
  const profileMenuRef = useRef(null);
  const notificationsRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const logoutConfirmRef = useRef(null);

  const [servers, setServers] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedServer, setSelectedServer] = useState(null);
  const [channels, setChannels] = useState([]);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showCreateChannelForm, setShowCreateChannelForm] = useState(false);



  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token'); // ✅ moved inside
  
      if (!token) {
        console.warn('No token found. Aborting fetch.');
        return;
      }
  
      try {
        const [userRes, serverRes] = await Promise.all([
          axios.get('http://localhost:3000/api/v1/users/avatar', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:3000/api/v1/server/', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
  
        setUser(userRes.data);
  
        const serversData = Array.isArray(serverRes.data)
          ? serverRes.data
          : serverRes.data.servers || [];
  
        setServers(serversData);
        setSelectedServer(null);
        setChannels([]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
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
    setIsLoggingOut(true);
  
    setTimeout(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      sessionStorage.clear();
      setShowLogoutConfirm(false);
      setIsLoggingOut(false);
      navigate('/login');
    }, 1000);
  }
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


  // Called when a server is clicked
  const handleSelectServer = async (server) => {

    // console.log('Selected server:', server);
    // console.log('Selected server _id:', server._id);

    setSelectedServer(server);
    setIsDirectMessagesSelected(false);
  
    const token = localStorage.getItem('token');
    if (!token) return;
  
    try {
      const channelsRes = await axios.get(
        `http://localhost:3000/api/v1/server/${server._id}/channels`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      setChannels(channelsRes.data); // Adjust if your API shape is different
    } catch (error) {
      console.error('Error fetching channels for selected server:', error);
      setChannels([]); // clear channels on error
    }
  };
  

// Called when Direct Messages is clicked
const handleSelectDirectMessages = () => {
  setSelectedServer(null);
  setIsDirectMessagesSelected(true);
};

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white overflow-hidden">
          <TopNavigation
        user={user}
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
        currentChannel={currentChannel}
        setCurrentChannel={setCurrentChannel}
        mobileMenuRef={mobileMenuRef}
        user={user}
        selectedServer={selectedServer}
        channels={channels}
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
        user={user}
        selectedServer={selectedServer}
        channels={channels}
        isDirectMessagesSelected={isDirectMessagesSelected}
        onOpenCreateChannel={() => setShowCreateChannelForm(true)}
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
        cancelLogout={() => setShowLogoutConfirm(false)}
        logoutConfirmRef={logoutConfirmRef}
        isLoggingOut={isLoggingOut}
      />

      <AddServerModal
        isOpen={showAddServerModal}
        onClose={() => setShowAddServerModal(false)}
        onCreate={handleCreateServer}
      />
      {showCreateChannelForm && (
  <AddChannelForm
    serverId={selectedServer?._id}
    userId={user?._id}
    onClose={() => setShowCreateChannelForm(false)}
    onCreate={(newChannel) => {
      setChannels(prev => [...prev, newChannel]);
    }}
  />
)}
    </div>
  );
}

export default Homepage;
