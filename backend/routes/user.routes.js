import express from 'express';

<<<<<<< HEAD
import { registerUser } from '../controllers/user.controller.js';
import { validateUserRegistration } from '../middlewares/validationMiddleware.js';

=======
import { googleLogin, loginUser, registerUser } from '../controllers/user.controller.js';
import { validateUserRegistration } from '../middlewares/validationMiddleware.js';
import { googleAuthController } from "../controllers/user.controller.js";
>>>>>>> b321080 (pushed)

const router = express.Router();

/**
 * @route   POST /api/users/register
 * @desc    Register a new user
 * @access  Public
 */
<<<<<<< HEAD
router
  .route('/register')
  .post(validateUserRegistration, registerUser);
=======
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


>>>>>>> b321080 (pushed)

export default router;
