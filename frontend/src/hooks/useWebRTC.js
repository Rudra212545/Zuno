// hooks/useWebRTC.js - Complete WebRTC implementation
import { useState, useRef, useEffect, useCallback } from 'react';
import socketService from '../utils/socket';

const useWebRTC = (channelId, isInitiator = false) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState(new Map());
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState(new Map());

  const localVideoRef = useRef(null);
  const peerConnections = useRef(new Map());
  const pendingCandidates = useRef(new Map());

  // WebRTC configuration
  const rtcConfig = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
    ],
  };

  // ✅ Initialize local media
  const initializeMedia = useCallback(async (video = false, audio = true) => {
    try {
      console.log('🎥 Initializing media...', { video, audio });
      
      const constraints = {
        audio: audio ? {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        } : false,
        video: video ? {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        } : false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      console.log('✅ Media initialized:', {
        audioTracks: stream.getAudioTracks().length,
        videoTracks: stream.getVideoTracks().length
      });

      setLocalStream(stream);
      setIsVideoEnabled(video);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      return stream;
    } catch (error) {
      console.error('❌ Error accessing media:', error);
      throw error;
    }
  }, []);

  // ✅ Create peer connection
  const createPeerConnection = useCallback((userId) => {
    console.log(`📞 Creating peer connection for user: ${userId}`);

    const peerConnection = new RTCPeerConnection(rtcConfig);

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('🧊 Sending ICE candidate to:', userId);
        socketService.socket?.emit('send-ice-candidate', {
          candidate: event.candidate,
          to: connectedUsers.get(userId)?.socketId,
          channelId
        });
      }
    };

    // Handle remote stream
    peerConnection.ontrack = (event) => {
      console.log('📺 Received remote stream from:', userId);
      const [remoteStream] = event.streams;
      
      setRemoteStreams(prev => {
        const newStreams = new Map(prev);
        newStreams.set(userId, remoteStream);
        return newStreams;
      });
    };

    // Handle connection state changes
    peerConnection.onconnectionstatechange = () => {
      console.log(`🔗 Connection state with ${userId}:`, peerConnection.connectionState);
      
      if (peerConnection.connectionState === 'disconnected' || 
          peerConnection.connectionState === 'failed') {
        handleUserLeft(userId);
      }
    };

    // Add local stream tracks
    if (localStream) {
      localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
      });
    }

    peerConnections.current.set(userId, peerConnection);
    return peerConnection;
  }, [localStream, channelId, connectedUsers]);

  // ✅ Join voice channel
  const joinVoiceChannel = useCallback(async (videoEnabled = false) => {
    try {
      console.log('🎤 Joining voice channel...', { channelId, videoEnabled });

      // Initialize media
      const stream = await initializeMedia(videoEnabled, true);
      
      // Join voice channel via socket
      socketService.socket?.emit('joinVoiceChannel', {
        channelId,
        userId: socketService.socket.id
      });

      setIsCallActive(true);
      setIsVideoEnabled(videoEnabled);

      console.log('✅ Successfully joined voice channel');
      return stream;
    } catch (error) {
      console.error('❌ Error joining voice channel:', error);
      throw error;
    }
  }, [channelId, initializeMedia]);

  // ✅ Leave voice channel
  const leaveVoiceChannel = useCallback(() => {
    console.log('🚪 Leaving voice channel...');

    // Stop local stream
    if (localStream) {
      localStream.getTracks().forEach(track => {
        track.stop();
      });
    }

    // Close all peer connections
    peerConnections.current.forEach((pc, userId) => {
      pc.close();
    });
    peerConnections.current.clear();

    // Clear states
    setLocalStream(null);
    setRemoteStreams(new Map());
    setIsCallActive(false);
    setConnectedUsers(new Map());
    
    // Notify server
    socketService.socket?.emit('leaveVoiceChannel', { channelId });

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }

    console.log('✅ Left voice channel');
  }, [localStream, channelId]);

  // ✅ Handle user joined
  const handleUserJoined = useCallback(async ({ userId, username, socketId }) => {
    console.log('👋 User joined voice:', { userId, username });

    setConnectedUsers(prev => {
      const newUsers = new Map(prev);
      newUsers.set(userId, { username, socketId });
      return newUsers;
    });

    if (localStream && isInitiator) {
      const peerConnection = createPeerConnection(userId);
      
      try {
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        
        console.log('📤 Sending offer to:', username);
        socketService.socket?.emit('send-offer', {
          offer,
          to: socketId,
          from: socketService.socket.id,
          channelId
        });
      } catch (error) {
        console.error('❌ Error creating offer:', error);
      }
    }
  }, [localStream, isInitiator, createPeerConnection, channelId]);

  // ✅ Handle user left
  const handleUserLeft = useCallback(({ userId, username }) => {
    console.log('👋 User left voice:', { userId, username });

    const peerConnection = peerConnections.current.get(userId);
    if (peerConnection) {
      peerConnection.close();
      peerConnections.current.delete(userId);
    }

    setRemoteStreams(prev => {
      const newStreams = new Map(prev);
      newStreams.delete(userId);
      return newStreams;
    });

    setConnectedUsers(prev => {
      const newUsers = new Map(prev);
      newUsers.delete(userId);
      return newUsers;
    });
  }, []);

  // ✅ Toggle mute
  const toggleMute = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
        console.log('🔇 Audio toggled:', audioTrack.enabled ? 'unmuted' : 'muted');
      }
    }
  }, [localStream]);

  // ✅ Toggle video
  const toggleVideo = useCallback(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
        console.log('📹 Video toggled:', videoTrack.enabled ? 'enabled' : 'disabled');
      }
    }
  }, [localStream]);

  // ✅ Screen sharing
  const toggleScreenShare = useCallback(async () => {
    try {
      if (!isScreenSharing) {
        console.log('🖥️ Starting screen share...');
        
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });

        // Replace video track in all peer connections
        const videoTrack = screenStream.getVideoTracks()[0];
        
        peerConnections.current.forEach((pc) => {
          const sender = pc.getSenders().find(s => 
            s.track && s.track.kind === 'video'
          );
          if (sender) {
            sender.replaceTrack(videoTrack);
          }
        });

        // Update local stream
        const newStream = new MediaStream([
          ...localStream.getAudioTracks(),
          videoTrack
        ]);

        setLocalStream(newStream);
        setIsScreenSharing(true);

        // Handle screen share end
        videoTrack.onended = () => {
          toggleScreenShare();
        };

        console.log('✅ Screen sharing started');
      } else {
        console.log('🖥️ Stopping screen share...');
        
        // Get camera back
        const videoStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });

        const videoTrack = videoStream.getVideoTracks()[0];

        // Replace screen track with camera track
        peerConnections.current.forEach((pc) => {
          const sender = pc.getSenders().find(s => 
            s.track && s.track.kind === 'video'
          );
          if (sender) {
            sender.replaceTrack(videoTrack);
          }
        });

        // Update local stream
        const newStream = new MediaStream([
          ...localStream.getAudioTracks(),
          videoTrack
        ]);

        setLocalStream(newStream);
        setIsScreenSharing(false);

        console.log('✅ Screen sharing stopped');
      }
    } catch (error) {
      console.error('❌ Error toggling screen share:', error);
    }
  }, [isScreenSharing, localStream]);

  // ✅ Socket event handlers
  useEffect(() => {
    const socket = socketService.socket;
    if (!socket) return;

    // Handle offer received
    const handleOfferReceived = async ({ offer, from, fromUserId, fromUsername }) => {
      console.log('📥 Offer received from:', fromUsername);

      const peerConnection = createPeerConnection(fromUserId);
      
      try {
        await peerConnection.setRemoteDescription(offer);
        
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        
        socket.emit('send-answer', {
          answer,
          to: from,
          from: socket.id,
          channelId
        });

        // Add pending ICE candidates
        const candidates = pendingCandidates.current.get(fromUserId) || [];
        candidates.forEach(candidate => {
          peerConnection.addIceCandidate(candidate);
        });
        pendingCandidates.current.delete(fromUserId);

        console.log('📤 Answer sent to:', fromUsername);
      } catch (error) {
        console.error('❌ Error handling offer:', error);
      }
    };

    // Handle answer received
    const handleAnswerReceived = async ({ answer, from, fromUserId }) => {
      console.log('📥 Answer received from:', fromUserId);

      const peerConnection = peerConnections.current.get(fromUserId);
      if (peerConnection) {
        try {
          await peerConnection.setRemoteDescription(answer);
          console.log('✅ Answer processed');
        } catch (error) {
          console.error('❌ Error handling answer:', error);
        }
      }
    };

    // Handle ICE candidate received
    const handleIceCandidateReceived = async ({ candidate, from, fromUserId }) => {
      console.log('🧊 ICE candidate received from:', fromUserId);

      const peerConnection = peerConnections.current.get(fromUserId);
      if (peerConnection && peerConnection.remoteDescription) {
        try {
          await peerConnection.addIceCandidate(candidate);
        } catch (error) {
          console.error('❌ Error adding ICE candidate:', error);
        }
      } else {
        // Store for later
        if (!pendingCandidates.current.has(fromUserId)) {
          pendingCandidates.current.set(fromUserId, []);
        }
        pendingCandidates.current.get(fromUserId).push(candidate);
      }
    };

    socket.on('receive-offer', handleOfferReceived);
    socket.on('receive-answer', handleAnswerReceived);
    socket.on('receive-ice-candidate', handleIceCandidateReceived);
    socket.on('user-joined', handleUserJoined);
    socket.on('user-left', handleUserLeft);

    return () => {
      socket.off('receive-offer', handleOfferReceived);
      socket.off('receive-answer', handleAnswerReceived);
      socket.off('receive-ice-candidate', handleIceCandidateReceived);
      socket.off('user-joined', handleUserJoined);
      socket.off('user-left', handleUserLeft);
    };
  }, [createPeerConnection, handleUserJoined, handleUserLeft, channelId]);

  // ✅ Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isCallActive) {
        leaveVoiceChannel();
      }
    };
  }, [isCallActive, leaveVoiceChannel]);

  return {
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
  };
};

export default useWebRTC;
  