import express from 'express';
import { 
  getInvites, 
  createInvite, 
  revokeInvite, 
  getInviteInfo, 
  useInvite 
} from '../controllers/invite.controller.js';

const router = express.Router();


router.get('/server/:serverId/invites', getInvites);    
router.post('/server/:serverId/invites', createInvite);  
// Individual invite routes
router.delete('/:inviteId', revokeInvite);              
router.get('/:code/info', getInviteInfo);                
router.post('/:code/use', useInvite);                

export default router;
