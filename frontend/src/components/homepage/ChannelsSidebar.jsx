import React, { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Hash, Volume2, Mic, MicOff, Headphones, Headphones as HeadphoneOff, Settings, ChevronDown, Plus, UserPlus, Bell, Shield, LogOut, MoreVertical, Edit3, Trash2, Lock, Users, Volume, VolumeX, Copy, Phone, PhoneOff, Video, VideoOff, Monitor, MonitorOff } from 'lucide-react';
import { Menu } from '@headlessui/react';
import { FiCheckCircle, FiClock, FiMinusCircle, FiEyeOff, FiSlash } from "react-icons/fi";

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
  // Separate text and voice channels from channels prop
  const textChannels = channels.filter(channel => channel.type === 'text');
  const voiceChannels = channels.filter(channel => channel.type === 'voice');

  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Call controls state
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

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

  // Handle call disconnect
  const handleDisconnectCall = () => {
    setCallActive(false);
    setCallChannelId(null);
    setIsVideoEnabled(false);
    setIsScreenSharing(false);
  };

  // Channel Settings Dropdown Component with Portal
  const ChannelSettingsDropdown = ({ channel, isVoiceChannel = false }) => {
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const buttonRef = useRef(null);
  
    const updatePosition = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const dropdownWidth = 224; // w-56 = 14rem = 224px
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
                    {/* Background Effects */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800/60 via-gray-900/60 to-slate-900/60 rounded-xl pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/10 via-purple-900/5 to-blue-900/10 rounded-xl pointer-events-none" />
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent" />
  
                    <div className="relative px-2 py-2 space-y-1">
                      {/* Edit Channel */}
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
  
                      {/* Copy Channel Link */}
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
  
                      {/* Manage Permissions */}
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active
                                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-500/30 scale-[1.02]'
                                : 'text-gray-300 hover:bg-white/10'
                            } group flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 relative overflow-hidden`}
                            onClick={() => console.log(`Manage permissions for ${channel.name}`)}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 to-orange-500/0 group-hover:from-amber-500/10 group-hover:to-orange-500/10 transition-all duration-300" />
                            <Lock size={14} className="mr-3 relative z-10" />
                            <span className="relative z-10">Manage Permissions</span>
                          </button>
                        )}
                      </Menu.Item>
  
                      {/* Invite People */}
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active
                                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/30 scale-[1.02]'
                                : 'text-gray-300 hover:bg-white/10'
                            } group flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 relative overflow-hidden`}
                            onClick={() => console.log(`Invite to ${channel.name}`)}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/10 group-hover:to-cyan-500/10 transition-all duration-300" />
                            <Users size={14} className="mr-3 relative z-10" />
                            <span className="relative z-10">Invite People</span>
                          </button>
                        )}
                      </Menu.Item>
                    </div>
  
                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-500/60 to-transparent relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent blur-sm" />
                    </div>
  
                    <div className="relative px-2 py-2">
                      {/* Delete Channel */}
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
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/10 via-purple-900/5 to-blue-900/10 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
      <div className="absolute -top-32 -left-32 w-64 h-64 bg-gradient-to-br from-indigo-600/10 to-purple-600/10 rounded-full blur-3xl animate-pulse" />
      
      {/* Enhanced Server Header */}
      <div className="relative z-50 h-16 px-6 flex items-center justify-between border-b border-gray-600/30 bg-gradient-to-r from-slate-900/98 via-gray-800/98 to-slate-900/98 backdrop-blur-xl shadow-2xl">
        {/* Enhanced background overlay with shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/15 via-purple-900/10 to-blue-900/15 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Server Info Section */}
        <div className="relative flex items-center space-x-3 group">
          <div className="flex items-center space-x-2 p-3 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/10 group-hover:to-purple-500/10 rounded-lg transition-all duration-300" />
            <h1 className="font-bold text-white text-xl tracking-tight bg-gradient-to-r from-white via-indigo-100 to-purple-100 bg-clip-text text-transparent group-hover:from-indigo-200 group-hover:via-purple-200 group-hover:to-pink-200 transition-all duration-500 relative z-10 drop-shadow-lg">
            {isDirectMessagesSelected ? 'Direct Messages' : selectedServer?.name || ''}
            </h1>
            {/* Subtle glow effect */}
            <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-indigo-500/20 group-hover:via-purple-500/20 group-hover:to-pink-500/20 rounded-lg blur-xl transition-all duration-500 -z-10" />
          </div>
        </div>

        {isDirectMessagesSelected ? (<div>
          </div>
          )
        :
        (
          // Enhanced Dropdown Menu with Portal
          <Menu as="div" className="relative z-[9999]">
            {({ open }) => {
              const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
              const buttonRef = useRef(null);

              const updatePosition = () => {
                if (buttonRef.current) {
                  const rect = buttonRef.current.getBoundingClientRect();
                  const dropdownWidth = 256; // w-64 = 16rem = 256px
                  
                  setDropdownPosition({
                    top: rect.bottom + 4,
                    left: Math.min(rect.right - dropdownWidth, window.innerWidth - dropdownWidth - 8),
                  });
                }
              };

              return (
                <>
                  <Menu.Button 
                    ref={buttonRef}
                    onClick={updatePosition}
                    className="group relative flex items-center p-2 text-gray-400 hover:text-white hover:bg-white/15 rounded-lg transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/30 border border-transparent hover:border-indigo-500/30 backdrop-blur-sm"
                  >
                    <ChevronDown 
                      size={20} 
                      className={`transition-all duration-300 ${
                        open ? 'rotate-180 text-indigo-400 drop-shadow-lg' : 'group-hover:text-indigo-400 group-hover:drop-shadow-lg'
                      }`} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/20 group-hover:to-purple-500/20 rounded-lg transition-all duration-300" />
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/10 group-hover:to-purple-500/10 rounded-lg blur-sm transition-all duration-300" />
                  </Menu.Button>

                  {open && createPortal(
                    <Menu.Items 
                      style={{
                        position: 'fixed',
                        top: dropdownPosition.top,
                        left: dropdownPosition.left,
                        zIndex: 9999
                      }}
                      className="w-64 bg-gray-900/98 backdrop-blur-2xl divide-y divide-gray-700/60 rounded-2xl shadow-2xl ring-1 ring-white/20 focus:outline-none border border-gray-700/40 overflow-hidden"
                      static
                    >
                      {/* Enhanced background gradient with animation */}
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-800/60 via-gray-900/60 to-slate-900/60 rounded-2xl pointer-events-none" />
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/10 via-purple-900/5 to-blue-900/10 rounded-2xl pointer-events-none" />
                      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent" />
                      
                      <div className="relative px-2 py-3 space-y-1">
                        {/* Create Channel */}
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              className={`${
                                active 
                                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-500/40 scale-[1.02] ring-1 ring-indigo-400/50' 
                                  : 'text-gray-300 hover:bg-white/10 border border-transparent hover:border-indigo-500/20'
                              } group flex w-full items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 hover:shadow-lg backdrop-blur-sm relative overflow-hidden`}
                              onClick={onOpenCreateChannel}
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/10 group-hover:to-purple-500/10 transition-all duration-300" />
                              <div className={`p-2 rounded-lg mr-3 relative z-10 ${
                                active ? 'bg-white/25 shadow-lg' : 'bg-indigo-500/15 group-hover:bg-indigo-500/25 border border-indigo-500/20'
                              } transition-all duration-300`}>
                                <Plus size={16} className={active ? 'text-white drop-shadow-sm' : 'text-indigo-400 group-hover:text-indigo-300'} />
                              </div>
                              <span className="relative z-10 font-semibold">Create Channel</span>
                            </button>
                          )}
                        </Menu.Item>

                        {/* Invite People */}
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              className={`${
                                active 
                                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xl shadow-emerald-500/40 scale-[1.02] ring-1 ring-emerald-400/50' 
                                  : 'text-gray-300 hover:bg-white/10 border border-transparent hover:border-emerald-500/20'
                              } group flex w-full items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 hover:shadow-lg backdrop-blur-sm relative overflow-hidden`}
                              onClick={() => console.log("Invite People")}
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/10 group-hover:to-teal-500/10 transition-all duration-300" />
                              <div className={`p-2 rounded-lg mr-3 relative z-10 ${
                                active ? 'bg-white/25 shadow-lg' : 'bg-emerald-500/15 group-hover:bg-emerald-500/25 border border-emerald-500/20'
                              } transition-all duration-300`}>
                                <UserPlus size={16} className={active ? 'text-white drop-shadow-sm' : 'text-emerald-400 group-hover:text-emerald-300'} />
                              </div>
                              <span className="relative z-10 font-semibold">Invite People</span>
                            </button>
                          )}
                        </Menu.Item>

                        {/* Notification Settings */}
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              className={`${
                                active 
                                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-xl shadow-amber-500/40 scale-[1.02] ring-1 ring-amber-400/50' 
                                  : 'text-gray-300 hover:bg-white/10 border border-transparent hover:border-amber-500/20'
                              } group flex w-full items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 hover:shadow-lg backdrop-blur-sm relative overflow-hidden`}
                              onClick={() => console.log("Notification Settings")}
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 to-orange-500/0 group-hover:from-amber-500/10 group-hover:to-orange-500/10 transition-all duration-300" />
                              <div className={`p-2 rounded-lg mr-3 relative z-10 ${
                                active ? 'bg-white/25 shadow-lg' : 'bg-amber-500/15 group-hover:bg-amber-500/25 border border-amber-500/20'
                              } transition-all duration-300`}>
                                <Bell size={16} className={active ? 'text-white drop-shadow-sm' : 'text-amber-400 group-hover:text-amber-300'} />
                              </div>
                              <span className="relative z-10 font-semibold">Notification Settings</span>
                            </button>
                          )}
                        </Menu.Item>

                        {/* Privacy Settings */}
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              className={`${
                                active 
                                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-xl shadow-blue-500/40 scale-[1.02] ring-1 ring-blue-400/50' 
                                  : 'text-gray-300 hover:bg-white/10 border border-transparent hover:border-blue-500/20'
                              } group flex w-full items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 hover:shadow-lg backdrop-blur-sm relative overflow-hidden`}
                              onClick={() => console.log("Privacy Settings")}
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/10 group-hover:to-cyan-500/10 transition-all duration-300" />
                              <div className={`p-2 rounded-lg mr-3 relative z-10 ${
                                active ? 'bg-white/25 shadow-lg' : 'bg-blue-500/15 group-hover:bg-blue-500/25 border border-blue-500/20'
                              } transition-all duration-300`}>
                                <Shield size={16} className={active ? 'text-white drop-shadow-sm' : 'text-blue-400 group-hover:text-blue-300'} />
                              </div>
                              <span className="relative z-10 font-semibold">Privacy Settings</span>
                            </button>
                          )}
                        </Menu.Item>

                        {/* Server Settings */}
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              className={`${
                                active 
                                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xl shadow-purple-500/40 scale-[1.02] ring-1 ring-purple-400/50' 
                                  : 'text-gray-300 hover:bg-white/10 border border-transparent hover:border-purple-500/20'
                              } group flex w-full items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 hover:shadow-lg backdrop-blur-sm relative overflow-hidden`}
                              onClick={() => console.log("Server Settings")}
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/10 transition-all duration-300" />
                              <div className={`p-2 rounded-lg mr-3 relative z-10 ${
                                active ? 'bg-white/25 shadow-lg' : 'bg-purple-500/15 group-hover:bg-purple-500/25 border border-purple-500/20'
                              } transition-all duration-300`}>
                                <Settings size={16} className={active ? 'text-white drop-shadow-sm' : 'text-purple-400 group-hover:text-purple-300'} />
                              </div>
                              <span className="relative z-10 font-semibold">Server Settings</span>
                            </button>
                          )}
                        </Menu.Item>
                      </div>

                      {/* Separator with enhanced styling */}
                      <div className="h-px bg-gradient-to-r from-transparent via-gray-500/60 to-transparent relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent blur-sm" />
                      </div>

                      <div className="relative px-2 py-3">
                        {/* Leave Server */}
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              className={`${
                                active 
                                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-xl shadow-red-500/40 scale-[1.02] ring-1 ring-red-400/50' 
                                  : 'text-red-400 hover:bg-red-500/15 border border-transparent hover:border-red-500/30'
                              } group flex w-full items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 hover:shadow-lg backdrop-blur-sm relative overflow-hidden`}
                              onClick={() => console.log("Leave Server")}
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 to-rose-500/0 group-hover:from-red-500/10 group-hover:to-rose-500/10 transition-all duration-300" />
                              <div className={`p-2 rounded-lg mr-3 relative z-10 ${
                                active ? 'bg-white/25 shadow-lg' : 'bg-red-500/15 group-hover:bg-red-500/25 border border-red-500/30'
                              } transition-all duration-300`}>
                                <LogOut size={16} className={active ? 'text-white drop-shadow-sm' : 'text-red-400 group-hover:text-red-300'} />
                              </div>
                              <span className="relative z-10 font-semibold">Leave Server</span>
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
        )}
      </div>
      
   {/* Channels or Direct Messages List */}
<div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-600/60 scrollbar-track-transparent relative">
  <div className="absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br from-purple-600/10 to-pink-600/10 rounded-full blur-2xl animate-pulse" />
  
  {isDirectMessagesSelected ? (
    /* Hardcoded friend list when Direct Messages is selected */
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
    /* Channels list when Direct Messages is NOT selected */
    <>
      {/* Text Channels */}
      <div className="pt-6 relative ">
        <div className="px-4 mb-3 flex items-center justify-between group">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest relative">
            Text Channels
            <div className="absolute -bottom-1 left-0 w-12 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full opacity-60" />
          </span>
          <Plus  size={16} onClick={onOpenCreateChannel} className="text-gray-400 cursor-pointer hover:text-white transition-all duration-300 hover:rotate-90 hover:scale-110 hover:drop-shadow-lg" />
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
            }}
            >
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

      {/* Voice Channels */}
      <div className="pt-6 relative ">
        <div className="px-4 mb-3 flex items-center justify-between group ">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest relative">
            Voice Channels
            <div className="absolute -bottom-1 left-0 w-14 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full opacity-60" />
          </span>
          <Plus size={16} onClick={onOpenCreateChannel} className="text-gray-400 cursor-pointer hover:text-white transition-all duration-300 hover:rotate-90 hover:scale-110 hover:drop-shadow-lg" />
        </div>
        {voiceChannels.map((channel) => (
          <div key={channel._id || channel.id} className="mx-3 relative">
            <div 
              className={`px-3 py-3 rounded-xl flex items-center cursor-pointer transition-all duration-300 group relative overflow-hidden border backdrop-blur-sm hover:shadow-lg ${
                callActive && callChannelId === channel._id
                  ? 'bg-gradient-to-r from-emerald-600/40 to-teal-600/40 text-white border-l-4 border-emerald-500 shadow-xl ring-1 ring-emerald-500/30 transform scale-[1.02]'
                  : 'text-gray-400 hover:bg-gradient-to-r hover:from-gray-700/40 hover:to-gray-600/30 hover:text-gray-200 border-transparent hover:border-gray-600/30'
              }`}
              onClick={() => {
                setCallActive(true);           // enable voice call UI
                setCallChannelId(channel._id);  // store the voice channel id
                console.log('channel.name:', channel.name); 
                setCurrentChannel(channel.name); // optional, if you want to track the name
                setCurrentChannelId(channel._id);
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/5 group-hover:to-teal-500/5 transition-all duration-300" />
              <div className="flex items-center flex-1 relative z-10">
                <Volume2 size={18} className="mr-3 opacity-70 group-hover:opacity-100 transition-all duration-300 group-hover:text-emerald-400 group-hover:drop-shadow-sm" />
                <span className="text-sm font-semibold group-hover:font-bold transition-all duration-300">{channel.name}</span>
              </div>
              <div className="flex items-center gap-2 relative z-10" >
                {channel.users && channel.users.length > 0 && (
                  <span className="text-xs text-green-400 font-bold bg-green-400/20 px-2.5 py-1 rounded-lg ring-1 ring-green-400/30 shadow-lg">
                    {channel.users.length}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-lg" />
                  </span>
                )}
                <ChannelSettingsDropdown channel={channel} isVoiceChannel={true} />
              </div>
            </div>
            {channel.users && channel.users.map((user, index) => (
              <div key={index} className="ml-9 px-3 py-2 text-xs text-gray-500 flex items-center hover:text-gray-400 transition-all duration-300 group rounded-lg hover:bg-gray-800/30 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 to-emerald-500/0 group-hover:from-green-500/5 group-hover:to-emerald-500/5 transition-all duration-300" />
                <div className="w-2.5 h-2.5 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full mr-3 animate-pulse shadow-lg ring-1 ring-green-400/30 relative z-10"></div>
                <span className="font-medium relative z-10 group-hover:text-green-400 transition-colors duration-300">{user}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  )}
</div>

      {/* Call Controls Section - Only show when call is active */}
      {callActive && (
        <div className="h-16 bg-gradient-to-r from-emerald-900/95 via-teal-900/95 to-emerald-900/95 backdrop-blur-xl px-4 flex items-center justify-between border-t border-emerald-700/40 shadow-2xl relative overflow-hidden">
          {/* Enhanced background effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/20 via-teal-900/10 to-emerald-900/20" />
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
          <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-gradient-to-br from-emerald-600/10 to-teal-600/10 rounded-full blur-2xl animate-pulse" />
          
          {/* Voice Channel Info */}
          <div className="flex items-center gap-3 relative z-10">
            <div className="flex items-center gap-2 p-2 bg-emerald-500/20 rounded-lg ring-1 ring-emerald-400/30 backdrop-blur-sm">
              <Volume2 size={16} className="text-emerald-400" />
              <span className="text-sm font-semibold text-white">
                {currentVoiceChannel?.name || 'Voice Channel'}
              </span>
            </div>
            <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse shadow-lg ring-1 ring-green-400/30" />
          </div>

          {/* Call Control Buttons */}
          <div className="flex items-center gap-2 relative z-10">
            {[
              {
                icon: isMuted ? MicOff : Mic,
                onClick: () => setIsMuted(prev => !prev),
                isActive: isMuted,
                activeColor: 'from-red-500 to-red-600',
                hoverColor: 'from-green-500 to-emerald-500',
                ring: 'ring-green-500/30',
                label: isMuted ? "Unmute" : "Mute"
              },
              {
                icon: isDeafened ? HeadphoneOff : Headphones,
                onClick: () => setIsDeafened(prev => !prev),
                isActive: isDeafened,
                activeColor: 'from-red-500 to-red-600',
                hoverColor: 'from-blue-500 to-cyan-500',
                ring: 'ring-blue-500/30',
                label: isDeafened ? "Undeafen" : "Deafen"
              },
              {
                icon: isVideoEnabled ? Video : VideoOff,
                onClick: () => setIsVideoEnabled(prev => !prev),
                isActive: isVideoEnabled,
                activeColor: 'from-indigo-500 to-purple-500',
                hoverColor: 'from-indigo-500 to-purple-500',
                ring: 'ring-indigo-500/30',
                label: isVideoEnabled ? "Turn Off Video" : "Turn On Video"
              },
              {
                icon: isScreenSharing ? Monitor : MonitorOff,
                onClick: () => setIsScreenSharing(prev => !prev),
                isActive: isScreenSharing,
                activeColor: 'from-orange-500 to-amber-500',
                hoverColor: 'from-orange-500 to-amber-500',
                ring: 'ring-orange-500/30',
                label: isScreenSharing ? "Stop Sharing" : "Share Screen"
              }
            ].map(({ icon: Icon, onClick, isActive, activeColor, hoverColor, ring, label }, index) => (
              <button
                key={index}
                onClick={onClick}
                title={label}
                className={`
                  group relative overflow-hidden p-2.5 rounded-xl border border-transparent
                  ${isActive 
                    ? `bg-gradient-to-r ${activeColor} text-white shadow-lg ring-1 ring-red-400/50` 
                    : `text-gray-300 hover:text-white hover:bg-gradient-to-r hover:${hoverColor} hover:ring-1 hover:${ring}`
                  }
                  hover:scale-110 hover:shadow-lg backdrop-blur-sm
                  transition-all duration-300
                `}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/0 group-hover:from-white/5 group-hover:to-white/10 transition-all duration-300" />
                <Icon size={16} className="relative z-10 group-hover:drop-shadow-lg" />
                <div className="absolute -inset-1 rounded-xl opacity-0 group-hover:opacity-100 blur-sm transition-all duration-300 bg-gradient-to-r from-current/20 to-current/10" />
              </button>
            ))}

            {/* Disconnect Call Button */}
            <button
              onClick={handleDisconnectCall}
              title="Disconnect"
              className="group relative overflow-hidden p-2.5 rounded-xl border border-transparent text-red-400 hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 hover:ring-1 hover:ring-red-500/50 hover:scale-110 hover:shadow-lg backdrop-blur-sm transition-all duration-300 ml-2"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/0 group-hover:from-white/5 group-hover:to-white/10 transition-all duration-300" />
              <PhoneOff size={16} className="relative z-10 group-hover:drop-shadow-lg" />
              <div className="absolute -inset-1 rounded-xl opacity-0 group-hover:opacity-100 blur-sm transition-all duration-300 bg-gradient-to-r from-red-500/20 to-red-600/10" />
            </button>
          </div>
        </div>
      )}
      
      {/* User Area */}
      <div className="h-20 bg-gradient-to-r from-slate-900/95 via-gray-900/95 to-slate-900/95 backdrop-blur-xl px-4 flex items-center border-t border-gray-700/40 shadow-2xl gap-7 relative overflow-hidden">
        {/* Enhanced background effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/10 via-purple-900/5 to-blue-900/10" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
        <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-gradient-to-br from-indigo-600/10 to-purple-600/10 rounded-full blur-2xl animate-pulse" />
        
        <div className="flex items-center flex-1 gap-7 relative z-10">
        <div className="relative group">
          <div className="w-12 h-12 rounded-full overflow-hidden ring-3 ring-green-400/60 ring-offset-2 ring-offset-gray-900 shadow-xl group-hover:ring-green-400/80 transition-all duration-300 group-hover:scale-105">
            <img 
              src={user?.profileImageUrl}
              alt={user?.name || "Profile"}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent group-hover:from-white/30 transition-all duration-300" />
          <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-green-400/20 to-emerald-400/20 blur-lg opacity-0 group-hover:opacity-100 transition-all duration-300" />
        </div>
          <div className="flex-1">
          <p className="font-bold text-white text-lg bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent drop-shadow-sm">{user?.username || "Guest"}</p>
          <div className="text-sm text-white font-medium flex items-center space-x-2 group">
            <div className="text-lg group-hover:scale-110 transition-transform duration-300">{icon}</div>
            <div className="bg-gradient-to-r from-gray-300 to-gray-100 bg-clip-text text-transparent group-hover:from-white group-hover:to-gray-200 transition-all duration-300">
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </div>
          </div>
          </div>
        </div>
        <div className="flex items-center gap-1 relative z-10">
        {/* Only show mic and headphones controls when NOT in a call */}
        {!callActive && [
  {
    icon: isMuted ? MicOff : Mic,
    ring: 'ring-green-500/30',
    bg: 'from-green-500/20 to-emerald-500/20',
    gradient: 'from-current/20 to-current/10',
    onClick: () => setIsMuted(prev => !prev),
    isActive: isMuted,
    label: isMuted ? "Unmute Mic" : "Mute Mic"
  },
  {
    icon: isDeafened ? HeadphoneOff : Headphones,
    ring: 'ring-blue-500/30',
    bg: 'from-blue-500/20 to-cyan-500/20',
    gradient: 'from-current/20 to-current/10',
    onClick: () => setIsDeafened(prev => !prev),
    isActive: isDeafened,
    label: isDeafened ? "Undeafen" : "Deafen"
  }
        ].map(({ icon: Icon, ring, bg, gradient, onClick, isActive, label }, index) => (
  <button
    key={index}
    onClick={onClick}
    aria-label={label}
    title={label}
    className={`
      group relative overflow-hidden p-2.5 rounded-xl border border-transparent
      ${isActive ? "text-white" : "text-gray-400"}
      hover:text-white hover:bg-gradient-to-r hover:${bg}
      hover:ring-1 hover:${ring}
      hover:scale-110 hover:shadow-lg backdrop-blur-sm
      transition-all duration-300
    `}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/0 group-hover:from-white/5 group-hover:to-white/10 transition-all duration-300" />
    <Icon size={18} className="relative z-10 group-hover:drop-shadow-lg" />
    <div className={`absolute -inset-1 rounded-xl opacity-0 group-hover:opacity-100 blur-sm transition-all duration-300 bg-gradient-to-r ${gradient}`} />
  </button>
))}

        {/* Settings button - always visible */}
        <button
          onClick={() => navigate('/settings')}
          aria-label="User Settings"
          title="User Settings"
          className="group relative overflow-hidden p-2.5 rounded-xl border border-transparent text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20 hover:ring-1 hover:ring-purple-500/30 hover:scale-110 hover:shadow-lg backdrop-blur-sm transition-all duration-300"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/0 group-hover:from-white/5 group-hover:to-white/10 transition-all duration-300" />
          <Settings size={18} className="relative z-10 group-hover:drop-shadow-lg" />
          <div className="absolute -inset-1 rounded-xl opacity-0 group-hover:opacity-100 blur-sm transition-all duration-300 bg-gradient-to-r from-current/20 to-current/10" />
        </button>

</div>

      </div>
    </div>
  );
};

export default ChannelsSidebar;