// components/homepage/CallUi.jsx - BUGS FIXED
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  PhoneOff, 
  Monitor, 
  MonitorOff, 
  Maximize2,
  MoreVertical
} from 'lucide-react';
import useWebRTC from '../../hooks/useWebRTC';
import { useSelector } from 'react-redux';

const CallUi = ({ channelId, onEndCall }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callStartTime] = useState(Date.now());

  const user = useSelector((state) => state.user.user);

  const {
    localStream,
    remoteStreams,
    isCallActive,
    isMuted,
    isVideoEnabled,
    isScreenSharing,
    connectedUsers,
    localVideoRef,
    joinVoiceChannel,
    leaveVoiceChannel,
    toggleMute,
    toggleVideo,
    toggleScreenShare,
  } = useWebRTC(channelId, true);

  // Call duration timer
  useEffect(() => {
    if (!isCallActive) return;
    const interval = setInterval(() => {
      setCallDuration(Math.floor((Date.now() - callStartTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [isCallActive, callStartTime]);

  // Auto-join voice channel
  useEffect(() => {
    if (!isCallActive) {
      joinVoiceChannel(false);
    }
  }, [isCallActive, joinVoiceChannel]);

  // Format call duration
  const formatDuration = useCallback((seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Handle end call
  const handleEndCall = useCallback(() => {
    leaveVoiceChannel();
    onEndCall?.();
  }, [leaveVoiceChannel, onEndCall]);

  const streamArray = useMemo(() => Array.from(remoteStreams.entries()), [remoteStreams]);
  const totalParticipants = useMemo(() => streamArray.length + 1, [streamArray.length]);

  // ✅ FIXED: Better username resolver with debugging
  const getDisplayName = useCallback((userId, index = 0) => {
    const userData = connectedUsers.get(userId);
    
    // 🔍 DEBUG: Log what we actually have
    console.log('🔍 User Data Debug:', {
      userId: userId,
      userData: userData,
      connectedUsersSize: connectedUsers.size,
      allUsers: Array.from(connectedUsers.entries())
    });

    // Try multiple approaches to get username
    if (userData) {
      if (userData.username) {
        console.log('✅ Found username:', userData.username);
        return userData.username;
      }
      if (userData.name) {
        console.log('✅ Found name:', userData.name);
        return userData.name;
      }
      if (userData.user?.username) {
        console.log('✅ Found nested username:', userData.user.username);
        return userData.user.username;
      }
    }

    // ✅ IMPROVED: Better fallback with readable format
    if (userId && userId.length > 8) {
      const shortId = userId.slice(-6);
      console.log('❌ Using fallback ID:', shortId);
      return `User_${shortId}`;
    }
    
    const fallback = `Guest_${index + 1}`;
    console.log('❌ Using guest fallback:', fallback);
    return fallback;
  }, [connectedUsers]);

  // ✅ FIXED: Video Grid Component
  const VideoGrid = React.memo(() => {
    const getGridClass = () => {
      if (isMinimized) return 'grid-cols-2 gap-2';
      if (totalParticipants <= 2) return 'grid-cols-1 lg:grid-cols-2 gap-6';
      if (totalParticipants <= 4) return 'grid-cols-2 gap-4';
      if (totalParticipants <= 6) return 'grid-cols-2 lg:grid-cols-3 gap-3';
      return 'grid-cols-3 lg:grid-cols-4 gap-2';
    };

    return (
      <div className={`grid h-full w-full p-6 ${getGridClass()}`}>
        {/* Local Video */}
        <VideoTile
          stream={localStream}
          username={user?.username || user?.name || 'You'}
          isLocal={true}
          isMuted={isMuted}
          isVideoEnabled={isVideoEnabled}
          isScreenSharing={isScreenSharing}
          ref={localVideoRef}
        />
        
        {/* ✅ FIXED: Remote Videos with proper debugging */}
        {streamArray.map(([userId, stream], index) => {
          const displayName = getDisplayName(userId, index);
          
          console.log('🎭 Rendering VideoTile:', { userId, displayName, hasStream: !!stream });
          
          return (
            <VideoTile
              key={userId}
              stream={stream}
              username={displayName}
              isLocal={false}
              isMuted={false}
              isVideoEnabled={stream?.getVideoTracks()?.length > 0 && stream?.getVideoTracks()?.[0]?.enabled}
            />
          );
        })}
      </div>
    );
  });

  VideoGrid.displayName = 'VideoGrid';

  // ✅ FIXED: Video Tile Component
  const VideoTile = React.forwardRef(({ 
    stream, 
    username, 
    isLocal, 
    isMuted, 
    isVideoEnabled,
    isScreenSharing
  }, ref) => {
    const videoRef = React.useRef(null);

    // ✅ DEBUG: Log what username is being rendered
    console.log('🎥 VideoTile rendering:', { username, isLocal, hasStream: !!stream });

    React.useEffect(() => {
      const videoElement = videoRef.current;
      if (videoElement && stream) {
        videoElement.srcObject = stream;
      }
      return () => {
        if (videoElement) {
          videoElement.srcObject = null;
        }
      };
    }, [stream]);

    return (
      <div className={`relative bg-gray-900 rounded-2xl overflow-hidden shadow-xl border border-gray-700/30 transition-all duration-300 hover:shadow-2xl group ${
        isMinimized ? 'min-h-[100px] max-h-[100px]' : 'min-h-[160px] max-h-[240px]'
      }`}>
        {isVideoEnabled && stream ? (
          <video
            ref={isLocal ? ref : videoRef}
            autoPlay
            playsInline
            muted={isLocal}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
            <div className="text-center">
              <div className={`bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-3 ${
                isMinimized ? 'w-12 h-12 text-lg' : 'w-16 h-16 text-xl'
              }`}>
                {username?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <p className={`text-white font-medium ${isMinimized ? 'text-sm' : 'text-base'}`}>
                {username || 'Unknown'}
              </p>
            </div>
          </div>
        )}
        
        {/* User Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className={`text-white font-medium ${isMinimized ? 'text-xs' : 'text-sm'}`}>
                {username || 'Unknown'}
              </span>
              {isScreenSharing && (
                <div className="flex items-center space-x-1 bg-green-500 px-2 py-1 rounded-full">
                  <Monitor size={10} />
                  <span className="text-xs text-white">Presenting</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-1">
              {isMuted && (
                <div className="bg-red-500/90 p-1.5 rounded-full backdrop-blur-sm">
                  <MicOff size={12} className="text-white" />
                </div>
              )}
              {!isVideoEnabled && stream && (
                <div className="bg-gray-600/90 p-1.5 rounded-full backdrop-blur-sm">
                  <VideoOff size={12} className="text-white" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  });

  VideoTile.displayName = 'VideoTile';

  // Bottom Controls
  const BottomControls = React.memo(() => (
    <div className="absolute bottom-0 left-0 right-0 bg-white/10 backdrop-blur-md border-t border-white/10 p-6 z-20">
      <div className="flex items-center justify-center space-x-6">
        {/* Mute Button */}
        <button
          onClick={toggleMute}
          className={`p-4 rounded-full transition-all duration-200 ${
            isMuted 
              ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg' 
              : 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-md'
          }`}
          title={isMuted ? 'Unmute' : 'Mute'}
          aria-label={isMuted ? 'Unmute microphone' : 'Mute microphone'}
        >
          {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
        </button>

        {/* Video Button */}
        <button
          onClick={toggleVideo}
          className={`p-4 rounded-full transition-all duration-200 ${
            isVideoEnabled 
              ? 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-md' 
              : 'bg-red-500 hover:bg-red-600 text-white shadow-lg'
          }`}
          title={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
          aria-label={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
        >
          {isVideoEnabled ? <Video size={24} /> : <VideoOff size={24} />}
        </button>

        {/* Screen Share Button */}
        <button
          onClick={toggleScreenShare}
          className={`p-4 rounded-full transition-all duration-200 ${
            isScreenSharing 
              ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg' 
              : 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-md'
          }`}
          title={isScreenSharing ? 'Stop presenting' : 'Present now'}
          aria-label={isScreenSharing ? 'Stop screen sharing' : 'Start screen sharing'}
        >
          {isScreenSharing ? <MonitorOff size={24} /> : <Monitor size={24} />}
        </button>

        {/* More Options */}
        <button
          className="p-4 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all duration-200"
          title="More options"
          aria-label="Show more options"
        >
          <MoreVertical size={24} />
        </button>

        {/* End Call Button */}
        <button
          onClick={handleEndCall}
          className="p-4 bg-red-500 hover:bg-red-600 text-white rounded-full transition-all duration-200 shadow-lg"
          title="Leave call"
          aria-label="End call"
        >
          <PhoneOff size={24} />
        </button>
      </div>
    </div>
  ));

  BottomControls.displayName = 'BottomControls';

  // Minimized UI
  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 w-80 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-gray-900 dark:text-white font-semibold">Voice Channel</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{formatDuration(callDuration)}</p>
            </div>
            <button
              onClick={() => setIsMinimized(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 transition-colors"
              aria-label="Maximize call window"
            >
              <Maximize2 size={18} />
            </button>
          </div>
          
          <VideoGrid />
          
          <div className="flex justify-center space-x-4 mt-4">
            <button
              onClick={toggleMute}
              className={`p-3 rounded-full transition-colors ${
                isMuted 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300'
              }`}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
            </button>

            <button
              onClick={toggleVideo}
              className={`p-3 rounded-full transition-colors ${
                isVideoEnabled 
                  ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300'
              }`}
              aria-label={isVideoEnabled ? 'Turn off video' : 'Turn on video'}
            >
              {isVideoEnabled ? <Video size={18} /> : <VideoOff size={18} />}
            </button>

            <button
              onClick={toggleScreenShare}
              className={`p-3 rounded-full transition-colors ${
                isScreenSharing 
                  ? 'bg-green-500 hover:bg-green-600 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300'
              }`}
              aria-label={isScreenSharing ? 'Stop sharing' : 'Share screen'}
            >
              {isScreenSharing ? <Monitor size={18} /> : <MonitorOff size={18} />}
            </button>
            
            <button
              onClick={handleEndCall}
              className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
              aria-label="End call"
            >
              <PhoneOff size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main Call UI
  return (
    <div className="h-full bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/3 to-pink-600/5 dark:from-blue-900/10 dark:via-purple-900/5 dark:to-pink-900/10"></div>
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)',
            backgroundSize: '20px 20px',
            opacity: 0.1
          }}
        />
      </div>

      {/* Video Grid - Takes full height minus bottom controls */}
      <div className="relative z-10 h-full pb-24">
        <VideoGrid />
      </div>

      {/* Bottom Controls */}
      <BottomControls />
    </div>
  );
};

export default CallUi;
