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

    // Listen for a chat message from client
    socket.on("chatMessage", (msg) => {
      console.log("Message received: ", msg);

      // Broadcast message to all connected clients
      io.emit("chatMessage", msg);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected: ", socket.id);
    });
  });
}

export { io };
