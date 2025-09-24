import { useEffect, useRef, useState } from "react";
import socket from "../socket"; // Your socket client

export default function useWebRTC(channelId, userId) {
  const [peers, setPeers] = useState({}); // { socketId: { stream, peerConnection } }
  const localStream = useRef(null);

  // Configuration for ICE servers (public STUN servers)
  const iceServers = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
    ],
  };

  useEffect(() => {
    if (!channelId || !userId) return;

    async function startLocalStream() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStream.current = stream;
        setPeers((prev) => ({ ...prev, local: { stream } }));
      } catch (error) {
        console.error("Error accessing media devices.", error);
      }
    }

    startLocalStream();

    // Join the voice channel on socket server
    socket.emit("joinVoiceChannel", { channelId, userId });

    // When a new user joins, create a peer connection and send offer
    socket.on("user-joined", async ({ userId: newUserId, socketId }) => {
      console.log("User joined call:", newUserId);

      if (!localStream.current) return;

      const peerConnection = new RTCPeerConnection(iceServers);

      // Add local tracks to peer connection
      localStream.current.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream.current);
      });

      // Listen for ICE candidates and send to peer
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("send-ice-candidate", {
            candidate: event.candidate,
            to: socketId,
          });
        }
      };

      // When remote stream arrives, add to peers state
      peerConnection.ontrack = (event) => {
        setPeers((prev) => ({
          ...prev,
          [socketId]: { stream: event.streams[0], peerConnection },
        }));
      };

      // Create offer and send to the new user
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      socket.emit("send-offer", {
        offer,
        to: socketId,
        from: socket.id,
      });

      setPeers((prev) => ({
        ...prev,
        [socketId]: { stream: null, peerConnection },
      }));
    });

    // When receiving an offer
    socket.on("receive-offer", async ({ offer, from }) => {
      if (!localStream.current) return;

      const peerConnection = new RTCPeerConnection(iceServers);

      // Add local tracks
      localStream.current.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream.current);
      });

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("send-ice-candidate", {
            candidate: event.candidate,
            to: from,
          });
        }
      };

      peerConnection.ontrack = (event) => {
        setPeers((prev) => ({
          ...prev,
          [from]: { stream: event.streams[0], peerConnection },
        }));
      };

      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      socket.emit("send-answer", {
        answer,
        to: from,
        from: socket.id,
      });

      setPeers((prev) => ({
        ...prev,
        [from]: { stream: null, peerConnection },
      }));
    });

    // When receiving an answer to our offer
    socket.on("receive-answer", async ({ answer, from }) => {
      const peer = peers[from];
      if (!peer) return;

      await peer.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    });

    // When receiving ICE candidate
    socket.on("receive-ice-candidate", async ({ candidate, from }) => {
      const peer = peers[from];
      if (peer && candidate) {
        try {
          await peer.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (error) {
          console.error("Error adding received ICE candidate", error);
        }
      }
    });

    // When a user leaves
    socket.on("user-left", ({ socketId }) => {
      console.log("User left call:", socketId);
      setPeers((prev) => {
        const updatedPeers = { ...prev };
        if (updatedPeers[socketId]) {
          updatedPeers[socketId].peerConnection.close();
          delete updatedPeers[socketId];
        }
        return updatedPeers;
      });
    });

    // Cleanup on unmount or channel change
    return () => {
      socket.emit("leaveVoiceChannel", { channelId });

      Object.values(peers).forEach(({ peerConnection }) => {
        if (peerConnection) peerConnection.close();
      });

      setPeers({});
      if (localStream.current) {
        localStream.current.getTracks().forEach((track) => track.stop());
      }

      socket.off("user-joined");
      socket.off("receive-offer");
      socket.off("receive-answer");
      socket.off("receive-ice-candidate");
      socket.off("user-left");
    };
  }, [channelId, userId]);

  return { peers, localStream: localStream.current };
}
