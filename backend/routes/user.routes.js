import express from 'express';

import { googleLogin, loginUser, registerUser, logoutUser, getUserProfile } from '../controllers/user.controller.js';
import { validateUserRegistration } from '../middlewares/validationMiddleware.js';
import { googleAuthController } from "../controllers/user.controller.js";
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

/**
 * @route   POST /api/users/register
 * @desc    Register a new user
 * @access  Public
 */
router
  .route('/register')
  .post(validateUserRegistration, registerUser);
// Normal User Registration 
router
  .route('/register')
  .post(validateUserRegistration, registerUser);
// Registration with Google
router.post("/google-auth", googleAuthController);
// Normal User Login 
router.post("/login",loginUser)
// Login With Google 
router.post("/google-login",googleLogin)

// Logout User 
router.post("logout",logoutUser);

// Get user info 
router.get('/avatar', verifyToken, getUserProfile);



export default router;
