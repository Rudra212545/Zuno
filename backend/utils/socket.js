import { Server } from "socket.io";

let io;

export function initChatSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", // your frontend origin
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected: ", socket.id);

    socket.on("joinChannel", ({ channelId }) => {
        socket.join(channelId);
        console.log(`User ${socket.id} joined channel ${channelId}`);
      });
      
      socket.on("chatMessage", ({ channelId, message, sender }) => {
        console.log(`Message to ${channelId}:`, message);
      
        // Broadcast only to users in the same channel
        io.to(channelId).emit("chatMessage", {
          channelId,
          message,
          sender,
          timestamp: Date.now(),
        });
      });
      

    socket.on("disconnect", () => {
      console.log("Client disconnected: ", socket.id);
    });
  });
}

export { io };
