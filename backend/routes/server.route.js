import express from 'express';
import {
  createServer,
  getAllServers,
  getServerInfo,
  getChannelsByServerId,
} from '../controllers/server.controller.js';
import upload from '../utils/upload.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

// Server creation
router.post('/create', verifyToken, upload.single('icon'), createServer);

// Fetch all servers
router.get('/', verifyToken, getAllServers);

// 🔥 This must come before /:id
router.get('/:id/channels', getChannelsByServerId);

// Get single server info
router.get('/:id', getServerInfo);

export default router;
