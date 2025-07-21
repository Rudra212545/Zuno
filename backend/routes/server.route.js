import express from 'express';
import { createServer, getAllServers } from '../controllers/server.controller.js';
import upload from '../utils/upload.js';
import { verifyToken } from '../middlewares/auth.js';


const router = express.Router();

router.post('/create',verifyToken, upload.single('icon'), createServer);

router.get("/",getAllServers);



export default router;
