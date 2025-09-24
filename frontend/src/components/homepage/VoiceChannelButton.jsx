// components/homepage/VoiceChannelButton.jsx - Voice Channel Interface
import React, { useState, useEffect } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Phone, 
  PhoneOff,
  Users,
  Settings,
  Headphones
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import useWebRTC from '../../hooks/useWebRTC';

const VoiceChannelButton = ({ channel, isSelected, onClick, connectedUsers = [] }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  const {
    isCallActive,
    isMuted,
    isVideoEnabled,
    joinVoiceChannel,
    leaveVoiceChannel,
    toggleMute,
    toggleVideo,
  } = useWebRTC(channel._id, false);

  // ✅ Handle join/leave voice channel
  const handleVoiceAction = async (e) => {
    e.stopPropagation();
    
    if (isCallActive) {
      leaveVoiceChannel();
    } else {
      try {
        await joinVoiceChannel(false); // Audio only by default
        onClick(channel); // Select the channel
      } catch (error) {
        console.error('Failed to join voice channel:', error);
        // You could show a toast notification here
      }
    }
  };

  // ✅ Handle video toggle
  const handleVideoToggle = (e) => {
    e.stopPropagation();
    if (!isCallActive) {
      joinVoiceChannel(true); // Join with video
      onClick(channel);
    } else {
      toggleVideo();
    }
  };

  // ✅ Handle mute toggle
  const handleMuteToggle = (e) => {
    e.stopPropagation();
    if (isCallActive) {
      toggleMute();
    }
  };

  return (
    <div
      className={`group relative flex items-center justify-between p-2 rounded-lg transition-all duration-200 cursor-pointer ${
        isSelected 
          ? 'bg-indigo-500/20 border-l-4 border-indigo-500' 
          : 'hover:bg-gray-600/30'
      } ${isCallActive ? 'bg-green-500/10 border-l-4 border-green-500' : ''}`}
      onClick={() => onClick(channel)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center space-x-3 flex-1">
        {/* Channel Icon */}
        <div className="relative">
          {isCallActive ? (
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <Volume2 size={12} className="text-white" />
            </div>
          ) : (
            <Volume2 size={20} className="text-gray-400" />
          )}
          
          {isCallActive && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          )}
        </div>

        {/* Channel Info */}
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium truncate ${
            isSelected || isCallActive ? 'text-white' : 'text-gray-300'
          }`}>
            {channel.name}
          </p>
          
          {/* Connected Users Count */}
          {connectedUsers.length > 0 && (
            <div className="flex items-center space-x-1 mt-1">
              <Users size={12} className="text-gray-500" />
              <span className="text-xs text-gray-500">{connectedUsers.length} connected</span>
            </div>
          )}
          
          {/* User Status */}
          {isCallActive && (
            <div className="flex items-center space-x-2 mt-1">
              {isMuted && (
                <div className="flex items-center space-x-1">
                  <MicOff size={10} className="text-red-400" />
                  <span className="text-xs text-red-400">Muted</span>
                </div>
              )}
              {isVideoEnabled && (
                <div className="flex items-center space-x-1">
                  <Video size={10} className="text-blue-400" />
                  <span className="text-xs text-blue-400">Video</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions (on hover) */}
      {(isHovered || showQuickActions) && (
        <div className="flex items-center space-x-1">
          {isCallActive ? (
            <>
              {/* Mute Toggle */}
              <button
                onClick={handleMuteToggle}
                className={`p-1.5 rounded transition-colors ${
                  isMuted 
                    ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <MicOff size={12} /> : <Mic size={12} />}
              </button>

              {/* Video Toggle */}
              <button
                onClick={handleVideoToggle}
                className={`p-1.5 rounded transition-colors ${
                  isVideoEnabled 
                    ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
                title={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
              >
                {isVideoEnabled ? <Video size={12} /> : <VideoOff size={12} />}
              </button>

              {/* Leave Call */}
              <button
                onClick={handleVoiceAction}
                className="p-1.5 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded transition-colors"
                title="Leave voice channel"
              >
                <PhoneOff size={12} />
              </button>
            </>
          ) : (
            <>
              {/* Join Voice */}
              <button
                onClick={handleVoiceAction}
                className="p-1.5 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded transition-colors"
                title="Join voice channel"
              >
                <Phone size={12} />
              </button>

              {/* Join with Video */}
              <button
                onClick={handleVideoToggle}
                className="p-1.5 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded transition-colors"
                title="Join with video"
              >
                <Video size={12} />
              </button>
            </>
          )}
        </div>
      )}

      {/* Connection Status Indicator */}
      {isCallActive && (
        <div className="absolute inset-0 bg-green-500/5 rounded-lg pointer-events-none"></div>
      )}
    </div>
  );
};

export default VoiceChannelButton;
