import express from 'express';
import { createMessage, getMessagesByChannel } from '../controllers/message.controller.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

// Get all messages in a channel
// GET /api/v1/messages/:channelId
router.get('/:channelId', verifyToken, getMessagesByChannel);

// Create a new message in a channel
// POST /api/v1/messages/:channelId
router.post('/:channelId', verifyToken, createMessage);

export default router;
