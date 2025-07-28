import express from 'express';
import { createChannel } from '../controllers/channel.controller.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

// POST /api/v1/channels/create/:serverId
router.post('/create/:serverId', verifyToken, createChannel);

export default router;
