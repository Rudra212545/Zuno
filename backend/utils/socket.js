import { Server } from "socket.io";

let io;

export function initChatSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected: ", socket.id);

    // Chat
    socket.on("joinChannel", ({ channelId }) => {
      socket.join(channelId);
      console.log(`User ${socket.id} joined channel ${channelId}`);
    });

    socket.on("chatMessage", ({ channelId, message, sender }) => {
      io.to(channelId).emit("chatMessage", {
        channelId,
        message,
        sender,
        timestamp: Date.now(),
      });
    });

    // Voice/Video Call Signaling
    socket.on("joinVoiceChannel", ({ channelId, userId }) => {
      socket.join(channelId);
      console.log(`User ${userId} (${socket.id}) joined voice channel ${channelId}`);
      socket.to(channelId).emit("user-joined", { userId, socketId: socket.id });
    });

    socket.on("send-offer", ({ offer, to, from }) => {
      io.to(to).emit("receive-offer", { offer, from });
    });

    socket.on("send-answer", ({ answer, to, from }) => {
      io.to(to).emit("receive-answer", { answer, from });
    });

    socket.on("send-ice-candidate", ({ candidate, to }) => {
      io.to(to).emit("receive-ice-candidate", { candidate, from: socket.id });
    });

    socket.on("leaveVoiceChannel", ({ channelId }) => {
      socket.leave(channelId);
      socket.to(channelId).emit("user-left", { socketId: socket.id });
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected: ", socket.id);
    });
  });
}

export { io };
