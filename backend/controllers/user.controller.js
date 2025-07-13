import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

// Helper: Generate tokens
const generateTokens = (user) => {
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  return { accessToken, refreshToken };
};

// Helper: Clean user object for response
const createUserResponse = (user) => {
  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.twoFactorSecret;
  delete userObj.devices;
  return userObj;
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
export const registerUser = asyncHandler(async (req, res,next) => {

  const errors = validationResult(req);

  // console.log("Raw Errors:", errors); // Debug
  // console.log("Array Errors:", errors.array()); // Debug

  if (!errors.isEmpty()) {
    // Create a map of field: message for clarity
    const formattedErrors = {};
    errors.array().forEach(err => {
      // Only show first message per field
      if (!formattedErrors[err.path]) {
        formattedErrors[err.path] = err.msg;
        // console.log(formattedErrors);
      }
    });

    // Send a structured error
    return next(new ApiError(400, "Validation failed", formattedErrors));
  }

  const {
    username,
    email,
    password,
    displayName,
    language = 'en',
    timezone = 'UTC'
  } = req.body;

  const existingUser = await User.findOne({
    $or: [
      { email: email.toLowerCase() },
      { username: username.toLowerCase() }
    ]
  });
  
  if (existingUser) {
    if (existingUser.email === email.toLowerCase()) {
      throw new ApiError(409, 'User with this email already exists', null, 'email');
    }
    if (existingUser.username === username.toLowerCase()) {
      throw new ApiError(409, 'User with this username already exists', null, 'username');
    }
  }
  

  const newUser = new User({
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    password,
    displayName,
    language,
    timezone,
    avatar: {
      url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName)}&backgroundColor=6366f1`,
      publicId: null
    }
  });

  const savedUser = await newUser.save();
  const { accessToken, refreshToken } = generateTokens(savedUser);
  const userResponse = createUserResponse(savedUser);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.status(201).json(
    new ApiResponse(201, {
      user: userResponse,
      accessToken
    }, 'User registered successfully')
  );
});
