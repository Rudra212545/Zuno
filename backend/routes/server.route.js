import express from 'express';
import { createServer, getAllServers, getServerInfo } from '../controllers/server.controller.js';
import upload from '../utils/upload.js';
import { verifyToken } from '../middlewares/auth.js';


const router = express.Router();
// Server Creation 
router.post('/create',verifyToken, upload.single('icon'), createServer);
// Fetching all servers 
router.get("/",verifyToken,getAllServers);

// For getting server info 
router.get("/:id",getServerInfo)



export default router;
