import dotenv from "dotenv";
import { createServer } from "http";
import connectDB from "./db/db.js";
import { app } from "./app.js";
import { initChatSocket } from "./utils/socket.js";

dotenv.config({
  path: './.env'
});

const httpServer = createServer(app);

// ✅ CRITICAL: Initialize socket server BEFORE connections
console.log('🔄 Setting up socket server...');
const io = initChatSocket(httpServer);
console.log('✅ Socket server initialized');

connectDB()
  .then(() => {
    const PORT = process.env.PORT || 3000; // Keep your port as 3000
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log('🔌 Socket server ready for connections');
    });
  })
  .catch((err) => {
    console.error('MongoDB connection failed!', err);
  });
