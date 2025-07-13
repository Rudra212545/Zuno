import express from 'express';

import { registerUser } from '../controllers/user.controller.js';
import { validateUserRegistration } from '../middlewares/validationMiddleware.js';


const router = express.Router();

/**
 * @route   POST /api/users/register
 * @desc    Register a new user
 * @access  Public
 */
router
  .route('/register')
  .post(validateUserRegistration, registerUser);

export default router;
