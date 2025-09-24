// components/homepage/ChannelsSidebar.jsx - FIXED VERSION
import React, { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Hash, Volume2, Mic, MicOff, Headphones, Headphones as HeadphoneOff, Settings, ChevronDown, Plus, UserPlus, Bell, Shield, LogOut, MoreVertical, Edit3, Trash2, Lock, Users, Volume, VolumeX, Copy, Phone, PhoneOff, Video, VideoOff, Monitor, MonitorOff } from 'lucide-react';
import { Menu } from '@headlessui/react';
import { FiCheckCircle, FiClock, FiMinusCircle, FiEyeOff, FiSlash } from "react-icons/fi";
import InvitePeopleModal from './invitePeopleModal';
import { useDispatch } from 'react-redux';
import { set } from '../../store/slices/uiSlice';
import { addChannel } from '../../store/slices/channelSlice';
import useWebRTC from '../../hooks/useWebRTC';

const ChannelsSidebar = ({ 
  currentChannel, 
  setCurrentChannel,
  setCurrentChannelId, 
  onVoiceChannelClick,
  isDirectMessagesSelected,
  setCallActive,
  setCallChannelId,
  callActive = false,
  callChannelId,
  user,
  selectedServer,
  channels,
  onOpenCreateChannel
}) => {
  const navigate = useNavigate(); 
  const dispatch = useDispatch();
  
  // Separate text and voice channels from channels prop
  const textChannels = channels.filter(channel => channel.type === 'text');
  const voiceChannels = channels.filter(channel => channel.type === 'voice');

  // ✅ Enhanced state management for WebRTC
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [activeVoiceChannel, setActiveVoiceChannel] = useState(null);
  
  // ✅ WebRTC integration for current voice channel
  const {
    localStream,
    remoteStreams,
    isCallActive: webRtcCallActive,
    isMuted: webRtcMuted,
    isVideoEnabled: webRtcVideo,
    isScreenSharing: webRtcScreen,
    connectedUsers,
    joinVoiceChannel,
    leaveVoiceChannel,
    toggleMute,
    toggleVideo,
    toggleScreenShare,
  } = useWebRTC(activeVoiceChannel, false);

  // ✅ Debug logging
  console.log('🔍 ChannelsSidebar Debug:', { 
    callActive, 
    callChannelId, 
    activeVoiceChannel,
    webRtcCallActive,
    userProp: !!user,
    channelsCount: channels.length
  });

  // ✅ Sync WebRTC state with local state
  useEffect(() => {
    console.log('🔄 WebRTC State Update:', {
      webRtcCallActive,
      webRtcMuted,
      activeVoiceChannel
    });

    if (webRtcCallActive && activeVoiceChannel) {
      console.log('✅ Setting call active:', activeVoiceChannel);
      setCallActive(true);
      setCallChannelId(activeVoiceChannel);
    }
    setIsMuted(webRtcMuted);
    setIsVideoEnabled(webRtcVideo);
    setIsScreenSharing(webRtcScreen);
  }, [webRtcCallActive, webRtcMuted, webRtcVideo, webRtcScreen, activeVoiceChannel, setCallActive, setCallChannelId]);

  const statusDetails = {
    online: { icon: <FiCheckCircle className="text-green-400" /> },
    away: { icon: <FiClock className="text-yellow-400" /> },
    busy: { icon: <FiMinusCircle className="text-red-500" /> },
    invisible: { icon: <FiEyeOff className="text-gray-500" /> },
    offline: { icon: <FiSlash className="text-gray-400" /> },
  };

  const status = user?.status?.toLowerCase() || "offline";
  const { icon } = statusDetails[status] || statusDetails["offline"];

  // Get current voice channel name
  const currentVoiceChannel = voiceChannels.find(channel => channel._id === callChannelId);

  // ✅ Enhanced call handlers with WebRTC
  const handleJoinVoiceChannel = async (channel, withVideo = false) => {
    try {
      console.log(`🎤 Joining voice channel: ${channel.name}${withVideo ? ' with video' : ''}`);
      
      setActiveVoiceChannel(channel._id);
      await joinVoiceChannel(withVideo);
      
      setCurrentChannel(channel.name);
      setCurrentChannelId(channel._id);
      
      // Force set call active immediately
      setCallActive(true);
      setCallChannelId(channel._id);
      
      console.log('✅ Successfully joined voice channel, callActive should be true');
    } catch (error) {
      console.error('❌ Failed to join voice channel:', error);
    }
  };

  const handleDisconnectCall = async () => {
    console.log('🚪 Leaving voice channel...');
    
    if (webRtcCallActive) {
      await leaveVoiceChannel();
    }
    
    setCallActive(false);
    setCallChannelId(null);
    setActiveVoiceChannel(null);
    setIsVideoEnabled(false);
    setIsScreenSharing(false);
    
    console.log('✅ Left voice channel, callActive should be false');
  };

  // ✅ Enhanced WebRTC control handlers
  const handleMuteToggle = () => {
    console.log('🔇 Toggling mute, webRtcCallActive:', webRtcCallActive);
    if (webRtcCallActive) {
      toggleMute();
    } else {
      setIsMuted(prev => !prev);
    }
  };

  const handleVideoToggle = () => {
    if (webRtcCallActive) {
      toggleVideo();
    } else {
      setIsVideoEnabled(prev => !prev);
    }
  };

  const handleScreenShareToggle = () => {
    if (webRtcCallActive) {
      toggleScreenShare();
    } else {
      setIsScreenSharing(prev => !prev);
    }
  };
  // ✅ Use webRtcCallActive instead of callActive for rendering
  const isInCall = webRtcCallActive; // Use WebRTC state directly
  const currentCallChannelId = activeVoiceChannel;

  // Get current voice channel name using WebRTC state
  // const currentVoiceChannel = voiceChannels.find(channel => channel._id === currentCallChannelId);

    const VoiceChannelItem = ({ channel }) => {
    const isCurrentChannel = isInCall && currentCallChannelId === channel._id; // Use WebRTC state
    const channelUsers = connectedUsers && activeVoiceChannel === channel._id 
      ? Array.from(connectedUsers.values()) 
      : channel.users || [];

    return (
      <div key={channel._id || channel.id} className="mx-3 relative">
        <div 
          className={`px-3 py-3 rounded-xl flex items-center cursor-pointer transition-all duration-300 group relative overflow-hidden border backdrop-blur-sm hover:shadow-lg ${
            isCurrentChannel
              ? 'bg-gradient-to-r from-emerald-600/40 to-teal-600/40 text-white border-l-4 border-emerald-500 shadow-xl ring-1 ring-emerald-500/30 transform scale-[1.02]'
              : 'text-gray-400 hover:bg-gradient-to-r hover:from-gray-700/40 hover:to-gray-600/30 hover:text-gray-200 border-transparent hover:border-gray-600/30'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/5 group-hover:to-teal-500/5 transition-all duration-300" />
          
          {/* Channel Info */}
          <div 
            className="flex items-center flex-1 relative z-10"
            onClick={() => {
              if (isCurrentChannel) {
                // If already connected, just switch UI focus
                setCurrentChannel(channel.name);
                setCurrentChannelId(channel._id);
              } else {
                // Join the voice channel
                handleJoinVoiceChannel(channel, false);
              }
            }}
          >
            <Volume2 size={18} className="mr-3 opacity-70 group-hover:opacity-100 transition-all duration-300 group-hover:text-emerald-400 group-hover:drop-shadow-sm" />
            <span className="text-sm font-semibold group-hover:font-bold transition-all duration-300">
              {channel.name}
            </span>
          </div>
          
          {/* Channel Controls */}
          <div className="flex items-center gap-2 relative z-10">
            {/* User count */}
            {channelUsers.length > 0 && (
              <span className="text-xs text-green-400 font-bold bg-green-400/20 px-2.5 py-1 rounded-lg ring-1 ring-green-400/30 shadow-lg">
                {channelUsers.length}
              </span>
            )}
            
            {/* Quick Join Controls (on hover) */}
            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity duration-300">
              {!isCurrentChannel && (
                <>
                  {/* Join Voice */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleJoinVoiceChannel(channel, false);
                    }}
                    className="p-1.5 text-green-400 hover:text-green-300 hover:bg-green-500/20 rounded-lg transition-all duration-200"
                    title="Join voice channel"
                  >
                    <Phone size={14} />
                  </button>
                  
                  {/* Join with Video */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleJoinVoiceChannel(channel, true);
                    }}
                    className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg transition-all duration-200"
                    title="Join with video"
                  >
                    <Video size={14} />
                  </button>
                </>
              )}
            </div>
            
            {/* Channel Settings */}
            <ChannelSettingsDropdown channel={channel} isVoiceChannel={true} />
          </div>
        </div>
        
        {/* Connected Users List */}
        {channelUsers.map((userData, index) => (
          <div key={index} className="ml-9 px-3 py-2 text-xs text-gray-500 flex items-center hover:text-gray-400 transition-all duration-300 group rounded-lg hover:bg-gray-800/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 to-emerald-500/0 group-hover:from-green-500/5 group-hover:to-emerald-500/5 transition-all duration-300" />
            <div className="w-2.5 h-2.5 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full mr-3 animate-pulse shadow-lg ring-1 ring-green-400/30 relative z-10"></div>
            <span className="font-medium relative z-10 group-hover:text-green-400 transition-colors duration-300">
              {typeof userData === 'string' ? userData : userData.username}
            </span>
            
            {/* User status indicators */}
            {isCurrentChannel && typeof userData === 'object' && (
              <div className="ml-auto flex items-center space-x-1">
                {userData.isMuted && (
                  <MicOff size={10} className="text-red-400" />
                )}
                {userData.hasVideo && (
                  <Video size={10} className="text-blue-400" />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // ✅ Channel Settings Dropdown
  const ChannelSettingsDropdown = ({ channel, isVoiceChannel = false }) => {
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const buttonRef = useRef(null);
  
    const updatePosition = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const dropdownWidth = 224;
        setDropdownPosition({
          top: rect.bottom + 4,
          left: Math.min(rect.right - dropdownWidth, window.innerWidth - dropdownWidth - 8),
        });
      }
    };
  
    return (
      <Menu as="div" className="relative z-[9999]">
        {({ open }) => {
          useEffect(() => {
            if (open) {
              updatePosition();
              window.addEventListener("resize", updatePosition);
              return () => window.removeEventListener("resize", updatePosition);
            }
          }, [open]);
  
          return (
            <>
              <Menu.Button
                ref={buttonRef}
                onClick={updatePosition}
                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300 hover:scale-110 border border-transparent hover:border-white/20 backdrop-blur-sm"
              >
                <MoreVertical size={14} className="drop-shadow-sm" />
              </Menu.Button>
  
              {open &&
                createPortal(
                  <Menu.Items
                    static
                    style={{
                      position: 'fixed',
                      top: dropdownPosition.top,
                      left: dropdownPosition.left,
                      zIndex: 9999,
                    }}
                    className="w-56 bg-gray-900/98 backdrop-blur-2xl divide-y divide-gray-700/60 rounded-xl shadow-2xl ring-1 ring-white/20 focus:outline-none border border-gray-700/40 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800/60 via-gray-900/60 to-slate-900/60 rounded-xl pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/10 via-purple-900/5 to-blue-900/10 rounded-xl pointer-events-none" />
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent" />
  
                    <div className="relative px-2 py-2 space-y-1">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 scale-[1.02]'
                                : 'text-gray-300 hover:bg-white/10'
                            } group flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 relative overflow-hidden`}
                            onClick={() => console.log(`Edit ${channel.name}`)}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/10 group-hover:to-purple-500/10 transition-all duration-300" />
                            <Edit3 size={14} className="mr-3 relative z-10" />
                            <span className="relative z-10">Edit Channel</span>
                          </button>
                        )}
                      </Menu.Item>

                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active
                                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30 scale-[1.02]'
                                : 'text-gray-300 hover:bg-white/10'
                            } group flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 relative overflow-hidden`}
                            onClick={() => console.log(`Copy link for ${channel.name}`)}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/10 group-hover:to-teal-500/10 transition-all duration-300" />
                            <Copy size={14} className="mr-3 relative z-10" />
                            <span className="relative z-10">Copy Channel Link</span>
                          </button>
                        )}
                      </Menu.Item>
                    </div>
  
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-500/60 to-transparent relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent blur-sm" />
                    </div>
  
                    <div className="relative px-2 py-2">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active
                                ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-500/30 scale-[1.02]'
                                : 'text-red-400 hover:bg-red-500/15'
                            } group flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 relative overflow-hidden`}
                            onClick={() => console.log(`Delete ${channel.name}`)}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 to-rose-500/0 group-hover:from-red-500/10 group-hover:to-rose-500/10 transition-all duration-300" />
                            <Trash2 size={14} className="mr-3 relative z-10" />
                            <span className="relative z-10">Delete Channel</span>
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>,
                  document.body
                )}
            </>
          );
        }}
      </Menu>
    );
  };

  return (
    <div className="hidden md:flex w-78 bg-gradient-to-b from-slate-900 via-gray-900 to-slate-950 flex-col border-r border-gray-700/40 mt-14 shadow-2xl relative">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/10 via-purple-900/5 to-blue-900/10 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
      <div className="absolute -top-32 -left-32 w-64 h-64 bg-gradient-to-br from-indigo-600/10 to-purple-600/10 rounded-full blur-3xl animate-pulse" />
      
      {/* ✅ Server Header with Dropdown */}
      <div className="relative z-50 h-16 px-6 flex items-center justify-between border-b border-gray-600/30 bg-gradient-to-r from-slate-900/98 via-gray-800/98 to-slate-900/98 backdrop-blur-xl shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/15 via-purple-900/10 to-blue-900/15 pointer-events-none" />
        
        <div className="relative flex items-center space-x-3 group">
          <div className="flex items-center space-x-2 p-3 relative">
            <h1 className="font-bold text-white text-xl tracking-tight bg-gradient-to-r from-white via-indigo-100 to-purple-100 bg-clip-text text-transparent group-hover:from-indigo-200 group-hover:via-purple-200 group-hover:to-pink-200 transition-all duration-500 relative z-10 drop-shadow-lg">
              {isDirectMessagesSelected ? 'Direct Messages' : selectedServer?.name || ''}
            </h1>
          </div>
        </div>

        {/* ✅ Server Dropdown Menu */}
        <Menu as="div" className="relative">
          <Menu.Button className="p-2 text-gray-400 hover:text-white hover:bg-gray-600/30 rounded-lg transition-all duration-200">
            <ChevronDown size={18} />
          </Menu.Button>
          <Menu.Items className="absolute right-0 mt-2 w-56 bg-gray-900 rounded-lg shadow-xl border border-gray-700 z-50">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${active ? 'bg-indigo-600 text-white' : 'text-gray-300'} group flex w-full items-center px-4 py-2 text-sm`}
                    onClick={() => setShowInviteModal(true)}
                  >
                    <UserPlus size={16} className="mr-3" />
                    Invite People
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Menu>
      </div>
      
      {/* Channels List */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-600/60 scrollbar-track-transparent relative">
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br from-purple-600/10 to-pink-600/10 rounded-full blur-2xl animate-pulse" />
        
        {isDirectMessagesSelected ? (
          <div className="pt-6 px-4 relative">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 block relative">
              Friends
              <div className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
            </span>
            {["Alice", "Bob", "Charlie", "David"].map((friend, i) => (
              <div
                key={i}
                className="px-3 py-3 rounded-xl flex items-center cursor-pointer text-gray-400 hover:bg-gradient-to-r hover:from-gray-700/40 hover:to-gray-600/30 hover:text-gray-200 transition-all duration-300 group relative overflow-hidden border border-transparent hover:border-gray-600/30 backdrop-blur-sm hover:shadow-lg"
                onClick={() => console.log(`Clicked friend: ${friend}`)}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/5 group-hover:to-purple-500/5 transition-all duration-300" />
                <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full mr-3 flex items-center justify-center text-sm font-bold text-white ring-2 ring-gray-600/50 group-hover:ring-indigo-500/50 transition-all duration-300 shadow-lg relative z-10">
                  {friend[0]}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full" />
                </div>
                <span className="text-sm font-semibold relative z-10 group-hover:text-white transition-colors duration-300">{friend}</span>
                <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-gradient-to-br from-green-400 to-green-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Text Channels */}
            <div className="pt-6 relative">
              <div className="px-4 mb-3 flex items-center justify-between group">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest relative">
                  Text Channels
                  <div className="absolute -bottom-1 left-0 w-12 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full opacity-60" />
                </span>
                <Plus size={16} onClick={() => dispatch(set({ key: "showCreateChannelForm", value: true }))} className="text-gray-400 cursor-pointer hover:text-white transition-all duration-300 hover:rotate-90 hover:scale-110 hover:drop-shadow-lg" />
              </div>
              {textChannels.map((channel) => (
                <div
                  key={channel._id || channel.id}
                  className={`mx-3 px-3 py-3 rounded-xl flex items-center justify-between cursor-pointer group transition-all duration-300 relative overflow-hidden backdrop-blur-sm ${
                    currentChannel === channel.name
                      ? 'bg-gradient-to-r from-indigo-600/40 to-purple-600/40 text-white border-l-4 border-indigo-500 shadow-xl ring-1 ring-indigo-500/30 transform scale-[1.02]'
                      : 'text-gray-400 hover:bg-gradient-to-r hover:from-gray-700/40 hover:to-gray-600/30 hover:text-gray-200 border border-transparent hover:border-gray-600/30 hover:shadow-lg'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/10 group-hover:to-purple-500/10 transition-all duration-300" />
                  <div className="flex items-center relative z-10" onClick={() =>{ 
                    setCurrentChannel(channel.name);
                    setCurrentChannelId(channel._id);
                  }}>
                    <Hash size={18} className="mr-3 opacity-70 group-hover:opacity-100 transition-all duration-300 group-hover:text-indigo-400 group-hover:drop-shadow-sm" />
                    <span className="text-sm font-semibold group-hover:font-bold transition-all duration-300">{channel.name}</span>
                  </div>
                  <div className="flex items-center gap-2 relative z-10">
                    {channel.unread && (
                      <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full px-2.5 py-1 min-w-[24px] text-center font-bold shadow-xl animate-pulse ring-2 ring-red-400/30">
                        {channel.unread}
                        <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent rounded-full" />
                      </span>
                    )}
                    <ChannelSettingsDropdown channel={channel} />
                  </div>
                  {currentChannel === channel.name && (
                    <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-indigo-400 to-purple-400 rounded-full shadow-lg" />
                  )}
                </div>
              ))}
            </div>

            {/* ✅ Voice Channels with WebRTC Integration */}
            <div className="pt-6 relative">
              <div className="px-4 mb-3 flex items-center justify-between group">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest relative">
                  Voice Channels
                  <div className="absolute -bottom-1 left-0 w-14 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full opacity-60" />
                </span>
                <Plus 
                  size={16} 
                  onClick={() => dispatch(set({ key: "showCreateChannelForm", value: true }))} 
                  className="text-gray-400 cursor-pointer hover:text-white transition-all duration-300 hover:rotate-90 hover:scale-110 hover:drop-shadow-lg" 
                />
              </div>
              {voiceChannels.map((channel) => (
                <VoiceChannelItem key={channel._id || channel.id} channel={channel} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* ✅ DISCORD-STYLE: Voice Controls ABOVE User Area (only when connected) */}
      {isInCall && (
        <div className="flex-shrink-0 bg-gradient-to-r from-emerald-900/95 via-teal-900/95 to-emerald-900/95 backdrop-blur-xl px-4 py-3 border-t border-emerald-700/40 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/20 via-teal-900/10 to-emerald-900/20" />
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
          
          {/* Voice Channel Info */}
          <div className="flex items-center justify-between mb-3 relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse shadow-lg ring-1 ring-green-400/30" />
              <span className="text-xs font-semibold text-emerald-200">
                Voice Connected
              </span>
            </div>
            <span className="text-xs text-emerald-300/70">
              {currentVoiceChannel?.name || 'Voice Channel'}
            </span>
          </div>

          {/* ✅ DISCORD-STYLE: Voice Control Buttons */}
          <div className="flex items-center justify-center gap-3 relative z-10">
            {/* Mute Button */}
            <button
              onClick={handleMuteToggle}
              title={isMuted ? "Unmute" : "Mute"}
              className={`
                group relative overflow-hidden p-3 rounded-full border border-transparent
                ${isMuted 
                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg ring-2 ring-red-400/50' 
                  : 'text-gray-300 hover:text-white bg-gray-700/50 hover:bg-gray-600/70'
                }
                hover:scale-110 hover:shadow-lg backdrop-blur-sm
                transition-all duration-300
              `}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/0 group-hover:from-white/10 group-hover:to-white/20 transition-all duration-300 rounded-full" />
              {isMuted ? <MicOff size={18} className="relative z-10" /> : <Mic size={18} className="relative z-10" />}
            </button>

            {/* Headphones Button */}
            <button
              onClick={() => setIsDeafened(prev => !prev)}
              title={isDeafened ? "Undeafen" : "Deafen"}
              className={`
                group relative overflow-hidden p-3 rounded-full border border-transparent
                ${isDeafened 
                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg ring-2 ring-red-400/50' 
                  : 'text-gray-300 hover:text-white bg-gray-700/50 hover:bg-gray-600/70'
                }
                hover:scale-110 hover:shadow-lg backdrop-blur-sm
                transition-all duration-300
              `}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/0 group-hover:from-white/10 group-hover:to-white/20 transition-all duration-300 rounded-full" />
              {isDeafened ? <HeadphoneOff size={18} className="relative z-10" /> : <Headphones size={18} className="relative z-10" />}
            </button>

            {/* Disconnect Button */}
            <button
              onClick={handleDisconnectCall}
              title="Disconnect"
              className="group relative overflow-hidden p-3 rounded-full border border-transparent text-red-400 hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 hover:ring-2 hover:ring-red-500/50 hover:scale-110 hover:shadow-lg backdrop-blur-sm transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/0 group-hover:from-white/10 group-hover:to-white/20 transition-all duration-300 rounded-full" />
              <PhoneOff size={18} className="relative z-10" />
            </button>
          </div>
        </div>
      )}
      
      {/* ✅ User Area - Clean when voice connected, normal when not */}
      <div className="flex-shrink-0 h-20 bg-gradient-to-r from-slate-900/95 via-gray-900/95 to-slate-900/95 backdrop-blur-xl px-4 flex items-center border-t border-gray-700/40 shadow-2xl gap-7 relative overflow-hidden">
        {/* Enhanced background effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/10 via-purple-900/5 to-blue-900/10" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
        <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-gradient-to-br from-indigo-600/10 to-purple-600/10 rounded-full blur-2xl animate-pulse" />
        
        <div className="flex items-center flex-1 gap-7 relative z-10">
          <div className="relative group">
            <div className="w-12 h-12 rounded-full overflow-hidden ring-3 ring-green-400/60 ring-offset-2 ring-offset-gray-900 shadow-xl group-hover:ring-green-400/80 transition-all duration-300 group-hover:scale-105">
              {user?.profileImageUrl || user?.avatar?.url ? (
                <img 
                  src={user.profileImageUrl || user.avatar?.url}
                  alt={user?.name || user?.username || "Profile"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              {/* ✅ Fallback avatar */}
              <div 
                className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg"
                style={{ display: (user?.profileImageUrl || user?.avatar?.url) ? 'none' : 'flex' }}
              >
                {(user?.username || user?.name || 'U').charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent group-hover:from-white/30 transition-all duration-300" />
            <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-green-400/20 to-emerald-400/20 blur-lg opacity-0 group-hover:opacity-100 transition-all duration-300" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-white text-lg bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent drop-shadow-sm">
              {user?.username || user?.name || "Guest"}
            </p>
            <div className="text-sm text-white font-medium flex items-center space-x-2 group">
              <div className="text-lg group-hover:scale-110 transition-transform duration-300">{icon}</div>
              <div className="bg-gradient-to-r from-gray-300 to-gray-100 bg-clip-text text-transparent group-hover:from-white group-hover:to-gray-200 transition-all duration-300">
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 relative z-10">
          {/* ✅ DISCORD STYLE: Only show mic/headphones when NOT in a call */}
          {!callActive && [
            {
              icon: isMuted ? MicOff : Mic,
              onClick: () => setIsMuted(prev => !prev),
              isActive: isMuted,
              label: isMuted ? "Unmute Mic" : "Mute Mic"
            },
            {
              icon: isDeafened ? HeadphoneOff : Headphones,
              onClick: () => setIsDeafened(prev => !prev),
              isActive: isDeafened,
              label: isDeafened ? "Undeafen" : "Deafen"
            }
          ].map(({ icon: Icon, onClick, isActive, label }, index) => (
            <button
              key={index}
              onClick={onClick}
              title={label}
              className={`
                group relative overflow-hidden p-2.5 rounded-xl border border-transparent
                ${isActive ? "text-white" : "text-gray-400"}
                hover:text-white hover:bg-gradient-to-r hover:from-green-500/20 hover:to-emerald-500/20
                hover:ring-1 hover:ring-green-500/30
                hover:scale-110 hover:shadow-lg backdrop-blur-sm
                transition-all duration-300
              `}
            >
              <Icon size={18} className="relative z-10 group-hover:drop-shadow-lg" />
            </button>
          ))}

          {/* Settings button - always visible */}
          <button
            onClick={() => navigate('/settings')}
            title="User Settings"
            className="group relative overflow-hidden p-2.5 rounded-xl border border-transparent text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20 hover:ring-1 hover:ring-purple-500/30 hover:scale-110 hover:shadow-lg backdrop-blur-sm transition-all duration-300"
          >
            <Settings size={18} className="relative z-10 group-hover:drop-shadow-lg" />
          </button>
        </div>
      </div>

      {/* ✅ Invite Modal */}
      {showInviteModal && (
        <InvitePeopleModal
          isOpen={showInviteModal}
          onClose={() => setShowInviteModal(false)}
          serverId={selectedServer?._id}
        />
      )}
    </div>
  );
};

export default ChannelsSidebar;
