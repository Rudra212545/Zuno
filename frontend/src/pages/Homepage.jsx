import React, { useState, useRef, useEffect } from 'react';
import TopNavigation from '../components/homepage/TopNavigation';
import MobileMenus from '../components/homepage/MobileMenus';
import ServersSidebar from '../components/homepage/ServersSidebar';
import ChannelsSidebar from '../components/homepage/ChannelsSidebar';
import ChatArea from '../components/homepage/ChatArea';
import LogoutModal from '../components/homepage/LogoutModal';
import {useNavigate} from "react-router-dom"


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
  const profileMenuRef = useRef(null);
  const notificationsRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const logoutConfirmRef = useRef(null);
  
  const [messages, setMessages] = useState([
    {
      id: 1,
      user: 'Sarah_Dev',
      content: 'Hey everyone! Just pushed the new feature to staging 🚀 The performance improvements are incredible!',
      timestamp: 'Today at 2:42 PM',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      role: 'admin'
    },
    {
      id: 2,
      user: 'Mike_Design',
      content: 'Looks absolutely amazing! 🎨 The new UI components are really clean and the animations are so smooth',
      timestamp: 'Today at 2:45 PM',
      avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      role: 'moderator'
    },
    {
      id: 3,
      user: 'Alex_PM',
      content: 'Perfect timing! 📅 We can demo this in tomorrow\'s client meeting. This will definitely impress them!',
      timestamp: 'Today at 2:48 PM',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      role: 'member'
    },
    {
      id: 4,
      user: 'Emma_QA',
      content: 'I\'ll run through all the test cases this evening and report any issues 🧪 So far everything looks solid!',
      timestamp: 'Today at 2:52 PM',
      avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      role: 'member'
    },
    {
      id: 5,
      user: 'DevBot',
      content: '🤖 Automated deployment to production completed successfully! Build #247 is now live.',
      timestamp: 'Today at 3:15 PM',
      avatar: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      role: 'bot'
    }
  ]);

  const servers = [
    { id: 1, name: 'Dev Team', icon: '🚀', active: true, notifications: 0 },
    { id: 2, name: 'Design Hub', icon: '🎨', notifications: 3 },
    { id: 3, name: 'Gaming Squad', icon: '🎮', notifications: 12 },
    { id: 4, name: 'Music Lounge', icon: '🎵', notifications: 0 },
    { id: 5, name: 'Study Group', icon: '📚', notifications: 1 }
  ];

  const notifications = [
    {
      id: 1,
      type: 'friend_request',
      user: 'Alex_Developer',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      message: 'sent you a friend request',
      time: '2 minutes ago',
      unread: true
    },
    {
      id: 2,
      type: 'mention',
      user: 'Sarah_Dev',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      message: 'mentioned you in #dev-updates',
      content: 'Hey @YourUsername, can you review the new feature?',
      time: '15 minutes ago',
      unread: true
    },
    {
      id: 3,
      type: 'server_invite',
      user: 'Mike_Design',
      avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      message: 'invited you to Design Hub server',
      time: '1 hour ago',
      unread: false
    },
    {
      id: 4,
      type: 'event',
      user: 'Team Calendar',
      avatar: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      message: 'Daily standup meeting in 30 minutes',
      time: '2 hours ago',
      unread: false
    }
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

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageInput.trim()) {
      const newMessage = {
        id: messages.length + 1,
        user: 'You',
        content: messageInput,
        timestamp: 'Today at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
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
    // Clear any stored user data
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    sessionStorage.clear();
    
    // Reset all state
    setIsLoggedIn(false);
    setShowLogoutConfirm(false);
    setShowProfileMenu(false);
    setShowNotifications(false);
    setShowMobileMenu(false);
    setShowChannels(false);
    
    // In a real app, you would redirect to login page
    // For demo purposes, we'll show a logout message
    navigate("/login")
    // Reset to logged in state for demo
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

  // Close mobile menus when switching to desktop
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

  // Show logout screen if user is not logged in
  if (!isLoggedIn) {
    return <LogoutScreen setIsLoggedIn={setIsLoggedIn} />;
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white overflow-hidden">
      <TopNavigation
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

      <ServersSidebar servers={servers} />

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
    </div>
  );
}

export default Homepage;