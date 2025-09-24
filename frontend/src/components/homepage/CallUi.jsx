// components/homepage/CallUi.jsx - Complete Call Interface
import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Phone, 
  PhoneOff, 
  Monitor, 
  MonitorOff, 
  Settings, 
  Volume2,
  VolumeX,
  Users,
  MessageSquare,
  Minimize2,
  Maximize2
} from 'lucide-react';
import useWebRTC from '../../hooks/useWebRTC';
import { useSelector } from 'react-redux';

const CallUi = ({ channelId, onEndCall }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [speakerEnabled, setSpeakerEnabled] = useState(true);
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

  // ✅ Call duration timer
  useEffect(() => {
    if (isCallActive) {
      const interval = setInterval(() => {
        setCallDuration(Math.floor((Date.now() - callStartTime) / 1000));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isCallActive, callStartTime]);

  // ✅ Auto-join voice channel on component mount
  useEffect(() => {
    if (!isCallActive) {
      joinVoiceChannel(false); // Start with audio only
    }
  }, []);

  // ✅ Format call duration
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // ✅ Handle end call
  const handleEndCall = () => {
    leaveVoiceChannel();
    onEndCall();
  };

  // ✅ Video Grid Component
  const VideoGrid = ({ streams, users, isMinimized }) => {
    const streamArray = Array.from(streams.entries());
    const totalParticipants = streamArray.length + 1; // +1 for local user
    
    const getGridClass = () => {
      if (isMinimized) return 'grid-cols-2 max-w-md';
      
      if (totalParticipants <= 2) return 'grid-cols-1 lg:grid-cols-2';
      if (totalParticipants <= 4) return 'grid-cols-2';
      if (totalParticipants <= 6) return 'grid-cols-2 lg:grid-cols-3';
      return 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
    };

    return (
      <div className={`grid gap-4 h-full w-full ${getGridClass()}`}>
        {/* Local Video */}
        <VideoTile
          stream={localStream}
          username={user?.username || 'You'}
          isLocal={true}
          isMuted={isMuted}
          isVideoEnabled={isVideoEnabled}
          isScreenSharing={isScreenSharing}
          ref={localVideoRef}
        />
        
        {/* Remote Videos */}
        {streamArray.map(([userId, stream]) => (
          <VideoTile
            key={userId}
            stream={stream}
            username={users.get(userId)?.username || 'User'}
            isLocal={false}
            isMuted={false}
            isVideoEnabled={stream.getVideoTracks().length > 0 && stream.getVideoTracks()[0].enabled}
          />
        ))}
      </div>
    );
  };

  // ✅ Video Tile Component
  const VideoTile = React.forwardRef(({ 
    stream, 
    username, 
    isLocal, 
    isMuted, 
    isVideoEnabled,
    isScreenSharing 
  }, ref) => {
    const videoRef = React.useRef(null);

    React.useEffect(() => {
      if (videoRef.current && stream) {
        videoRef.current.srcObject = stream;
      }
    }, [stream]);

    return (
      <div className="relative bg-gray-800 rounded-xl overflow-hidden shadow-2xl border border-gray-600/50">
        {isVideoEnabled && stream ? (
          <video
            ref={isLocal ? ref : videoRef}
            autoPlay
            playsInline
            muted={isLocal}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4 mx-auto">
                {username.charAt(0).toUpperCase()}
              </div>
              <p className="text-white font-medium">{username}</p>
            </div>
          </div>
        )}
        
        {/* User Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
          <div className="flex items-center justify-between">
            <span className="text-white text-sm font-medium">{username}</span>
            <div className="flex items-center space-x-2">
              {isScreenSharing && (
                <div className="flex items-center space-x-1 bg-green-500 px-2 py-1 rounded-full">
                  <Monitor size={12} />
                  <span className="text-xs text-white">Screen</span>
                </div>
              )}
              {isMuted && (
                <div className="bg-red-500 p-1 rounded-full">
                  <MicOff size={12} className="text-white" />
                </div>
              )}
              {!isVideoEnabled && stream && (
                <div className="bg-gray-500 p-1 rounded-full">
                  <VideoOff size={12} className="text-white" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  });

  // ✅ Participants Panel
  const ParticipantsPanel = () => (
    <div className="absolute top-16 right-4 w-80 bg-gray-800 rounded-xl shadow-2xl border border-gray-600/50 p-4 z-20">
      <h3 className="text-white font-semibold mb-4 flex items-center">
        <Users size={20} className="mr-2" />
        Participants ({connectedUsers.size + 1})
      </h3>
      
      <div className="space-y-3 max-h-60 overflow-y-auto">
        {/* Local User */}
        <div className="flex items-center space-x-3 p-2 bg-gray-700/50 rounded-lg">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
            {user?.username?.charAt(0).toUpperCase() || 'Y'}
          </div>
          <div className="flex-1">
            <p className="text-white text-sm font-medium">{user?.username || 'You'} (You)</p>
            <p className="text-gray-400 text-xs">Host</p>
          </div>
          <div className="flex space-x-1">
            {isMuted && <MicOff size={16} className="text-red-400" />}
            {!isVideoEnabled && <VideoOff size={16} className="text-gray-400" />}
          </div>
        </div>
        
        {/* Remote Users */}
        {Array.from(connectedUsers.entries()).map(([userId, userData]) => (
          <div key={userId} className="flex items-center space-x-3 p-2 hover:bg-gray-700/30 rounded-lg transition-colors">
            <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {userData.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1">
              <p className="text-white text-sm font-medium">{userData.username}</p>
              <p className="text-gray-400 text-xs">Participant</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ✅ Minimized Call UI
  if (isMinimized) {
    return (
      <div className="fixed top-20 right-4 w-80 bg-gray-800 rounded-xl shadow-2xl border border-gray-600/50 z-50">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-white font-semibold">Voice Channel</h3>
              <p className="text-gray-400 text-sm">{formatDuration(callDuration)}</p>
            </div>
            <button
              onClick={() => setIsMinimized(false)}
              className="text-gray-400 hover:text-white p-1"
            >
              <Maximize2 size={18} />
            </button>
          </div>
          
          <VideoGrid streams={remoteStreams} users={connectedUsers} isMinimized={true} />
          
          <div className="flex justify-center space-x-2 mt-4">
            <button
              onClick={toggleMute}
              className={`p-2 rounded-lg transition-colors ${
                isMuted 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              }`}
            >
              {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
            
            <button
              onClick={handleEndCall}
              className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              <PhoneOff size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Full Call UI
  return (
    <div className="h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-600/20"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-4 bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-white font-semibold">Voice Channel</span>
          </div>
          <span className="text-gray-400 text-sm">{formatDuration(callDuration)}</span>
          <span className="text-gray-400 text-sm">•</span>
          <span className="text-gray-400 text-sm">{connectedUsers.size + 1} participants</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowParticipants(!showParticipants)}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            title="Show participants"
          >
            <Users size={20} />
          </button>
          
          <button
            onClick={() => setIsMinimized(true)}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            title="Minimize"
          >
            <Minimize2 size={20} />
          </button>
        </div>
      </div>

      {/* Video Grid */}
      <div className="relative z-10 flex-1 p-6">
        <VideoGrid streams={remoteStreams} users={connectedUsers} isMinimized={false} />
      </div>

      {/* Controls */}
      <div className="relative z-10 p-6 bg-gray-800/50 backdrop-blur-sm border-t border-gray-700/50">
        <div className="flex items-center justify-center space-x-4">
          {/* Mute Button */}
          <button
            onClick={toggleMute}
            className={`p-4 rounded-full transition-all duration-200 ${
              isMuted 
                ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg scale-110' 
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:scale-110'
            }`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
          </button>

          {/* Video Button */}
          <button
            onClick={toggleVideo}
            className={`p-4 rounded-full transition-all duration-200 ${
              isVideoEnabled 
                ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg' 
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
            } hover:scale-110`}
            title={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
          >
            {isVideoEnabled ? <Video size={24} /> : <VideoOff size={24} />}
          </button>

          {/* Screen Share Button */}
          <button
            onClick={toggleScreenShare}
            className={`p-4 rounded-full transition-all duration-200 ${
              isScreenSharing 
                ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg' 
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
            } hover:scale-110`}
            title={isScreenSharing ? 'Stop sharing' : 'Share screen'}
          >
            {isScreenSharing ? <MonitorOff size={24} /> : <Monitor size={24} />}
          </button>

          {/* Speaker Button */}
          <button
            onClick={() => setSpeakerEnabled(!speakerEnabled)}
            className={`p-4 rounded-full transition-all duration-200 ${
              speakerEnabled 
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                : 'bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg'
            } hover:scale-110`}
            title={speakerEnabled ? 'Mute speaker' : 'Unmute speaker'}
          >
            {speakerEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
          </button>

          {/* End Call Button */}
          <button
            onClick={handleEndCall}
            className="p-4 bg-red-500 hover:bg-red-600 text-white rounded-full transition-all duration-200 hover:scale-110 shadow-lg"
            title="End call"
          >
            <PhoneOff size={24} />
          </button>
        </div>
      </div>

      {/* Participants Panel */}
      {showParticipants && <ParticipantsPanel />}
    </div>
  );
};

export default CallUi;
