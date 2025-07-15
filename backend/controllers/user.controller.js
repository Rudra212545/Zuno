import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { admin } from "../utils/firebase.js";
import bcrypt from 'bcrypt';


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

    console.log(formattedErrors);
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
    language,
    timezone,
    avatar: {
      url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(username)}&backgroundColor=6366f1`,
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

export const googleAuthController = asyncHandler(async (req, res, next) => {
  const { idToken } = req.body;

  if (!idToken) {
    throw new ApiError(400, "No ID token provided");
  }

  let decodedToken;
  try {
    decodedToken = await admin.auth().verifyIdToken(idToken);
  } catch (err) {
    console.error("Firebase ID Token verification failed:", err);
    throw new ApiError(401, "Invalid ID token");
  }

  const { uid, email, name, } = decodedToken;

  let user = await User.findOne({ uid });

  if (!user) {
    user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        googleId: uid,
        email,
        username: name.toLowerCase().replace(/\s/g, '') + Math.floor(Math.random() * 10000),
        isOAuth: true,
        avatar: {
          url: decodedToken.picture || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=6366f1`,
          publicId: null
        },
        language: 'en',
        timezone: 'UTC',
      });
      
    } else {
      user.uid = uid; // link UID to existing email user
      await user.save();
    }
  }

  const { accessToken, refreshToken } = generateTokens(user);
  const userResponse = createUserResponse(user);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.status(200).json(
    new ApiResponse(200, {
      user: userResponse,
      accessToken
    }, "Google sign-in successful")
  );
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Input validation
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  // 1. Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(400, "Invalid email or password");
  }


  // 2. Compare passwords
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(400, "Invalid email or password");
  }

  // 3. Generate JWT token
  const token = jwt.sign(
    { 
      id: user._id,
      email: user.email 
    }, 
    process.env.JWT_SECRET, 
    {
      expiresIn: "7d",
    }
  );

  // 4. Prepare user response (exclude password)
  const userResponse = {
    id: user._id,
    email: user.email,
    username: user.username,
  };

  // 5. Send success response
  return res
    .status(200)
    .json(new ApiResponse(200, { token, user: userResponse }, "Login successful"));
});

export const googleLogin = asyncHandler(async (req, res, next) => {
  try {
    const { name, email, uid, photoURL } = req.body;

    if (!name || !email || !uid) {
      throw new ApiError(400, 'Missing required fields: name, email, and uid are required');
    }

    let user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      if (!user.googleId) {
        user.googleId = uid;
        user.photoURL = photoURL || user.photoURL;
        user.avatar.url =
          photoURL ||
          user.avatar.url ||
          `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=6366f1`;
        user.username = user.username || name.toLowerCase().replace(/\s/g, '') + Math.floor(Math.random() * 10000);
        user.authProvider = 'google';
        user.isEmailVerified = true;
        user.lastLogin = new Date();

        await user.save();
      } else {
        user.lastLogin = new Date();
        await user.save();
      }
    } else {
      user = new User({
        username: name.toLowerCase().replace(/\s/g, '') + Math.floor(Math.random() * 10000),
        email: email.toLowerCase(),
        password: await bcrypt.hash(uid + process.env.JWT_SECRET, 12),
        googleUID: uid,
        photoURL: photoURL || '',
        avatar: {
          url:
            photoURL ||
            `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=6366f1`,
          publicId: null,
        },
        isEmailVerified: true,
        authProvider: 'google',
        isOAuth: true,
        language: 'en',
        timezone: 'UTC',
        lastLogin: new Date(),
      });

      await user.save();
    }

    const { accessToken, refreshToken } = generateTokens(user);

    user.refreshToken = refreshToken;
    await user.save();

    const userResponse = createUserResponse(user);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json(
      new ApiResponse(200, { user: userResponse, accessToken }, 'Google login successful')
    );
  } catch (err) {
    next(err);
  }
});
