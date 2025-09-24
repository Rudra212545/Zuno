// routes/invite.route.js
import express from 'express';
import {
  createInvite,
  getInviteInfo,
  joinServerByInvite,
  getServerInvites,
  revokeInvite
} from '../controllers/invite.controller.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

// Public routes
router.get('/:inviteCode', getInviteInfo); // Get invite info (public)

// Protected routes
router.post('/:serverId', verifyToken, createInvite); // Create invite
router.post('/join/:inviteCode', verifyToken, joinServerByInvite); // Join server by invite
router.get('/server/:serverId', verifyToken, getServerInvites); // Get server invites
router.delete('/:inviteCode', verifyToken, revokeInvite); // Revoke invite

export default router;
