import express from 'express';
import { verifyToken } from '../middlewares/auth.js';
import { 
  getInvites, 
  createInvite, 
  revokeInvite, 
  getInviteInfo, 
  useInvite 
} from '../controllers/invite.controller.js';

const router = express.Router();


router.get('/server/:serverId/invites', verifyToken,getInvites);    
router.post('/server/:serverId/invites',verifyToken, createInvite);  
// Individual invite routes
router.delete('/:inviteId', revokeInvite);              
router.get('/:code/info', getInviteInfo);                
router.post('/:code/use',verifyToken, useInvite);                

export default router;
