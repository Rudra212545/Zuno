import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { admin } from "../utils/firebase.js";
import bcrypt from 'bcrypt';
import { uploadToCloudinary } from '../utils/upload.js';


const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET;

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
  
  const userResponse = createUserResponse(savedUser);

  // ✅ THIS is the object you're signing with JWT
  const token = jwt.sign(
    { _id: newUser._id, email: newUser.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.status(201).json(
    new ApiResponse(201, {
      user: userResponse,
      token
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
      _id: user._id,
      email: user.email 
    }, 
    process.env.ACCESS_TOKEN_SECRET, 
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

export const logoutUser = asyncHandler(async (req, res) => {
  return res.status(200).json({
    message: "User logged out (client should delete token)"
  });
});

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;  // <-- from auth middleware

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findById(userId).select('username avatar status email');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const profileImageUrl = user.avatar?.url || null;
    const usernameFirstLetter = user.username?.charAt(0).toUpperCase() || null;
    const status = user?.status || "No status "

    res.json({
      username: user.username,
      profileImageUrl,
      usernameFirstLetter,
      status,
      email:user.email

    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { username, email, status } = req.body;
    const userId = req.user._id;

    // Get current user data first
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log("Current user:", currentUser.username, currentUser.email);
    console.log("Update request:", { username, email, status });

    // Build update object with only fields that are actually changing
    const updateFields = {};

    // Only validate and update username if it's different
    if (username && username.trim() !== currentUser.username) {
      // Username validation
      if (username.length < 3 || username.length > 20) {
        return res.status(400).json({
          success: false,
          message: 'Username must be between 3 and 20 characters'
        });
      }

      // Check if username is taken by another user
      const usernameExists = await User.findOne({
        username: username.trim(),
        _id: { $ne: userId }
      });

      if (usernameExists) {
        return res.status(400).json({
          success: false,
          message: 'Username is already taken by another user'
        });
      }

      updateFields.username = username.trim();
    }

    // Only validate and update email if it's different
    if (email && email.toLowerCase().trim() !== currentUser.email.toLowerCase()) {
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid email address'
        });
      }

      // Check if email is taken by another user
      const emailExists = await User.findOne({
        email: email.toLowerCase().trim(),
        _id: { $ne: userId }
      });

      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'Email is already taken by another user'
        });
      }

      updateFields.email = email.toLowerCase().trim();
    }

    // Always allow status updates (no validation needed)
    if (status && status !== currentUser.status) {
      updateFields.status = status;
    }

    // If no fields are actually changing
    if (Object.keys(updateFields).length === 0) {
      return res.json({
        success: true,
        message: 'No changes detected',
        user: {
          ...currentUser.toObject(),
          profileImageUrl: currentUser.profileImageUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${currentUser.username}&backgroundColor=6366f1`,
          usernameFirstLetter: currentUser.username?.charAt(0)?.toUpperCase()
        }
      });
    }

    // Add timestamp for actual updates
    updateFields.updatedAt = new Date();

    console.log("Fields to update:", updateFields);

    // Perform the update
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateFields,
      { new: true, runValidators: true }
    ).select('-password');

    const responseData = {
      ...updatedUser.toObject(),
      profileImageUrl: updatedUser.profileImageUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${updatedUser.username}&backgroundColor=6366f1`,
      usernameFirstLetter: updatedUser.username?.charAt(0)?.toUpperCase()
    };

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: responseData
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

export const updateUserAvatar = async (req, res) => {
  console.log("=== AVATAR CONTROLLER ===");
  console.log("User ID:", req.user?._id);
  console.log("File received:", req.file ? "YES" : "NO");

  try {
    const userId = req.user._id;

    if (!req.file) {
      console.log("❌ No file in request");
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    console.log("✅ File details:", {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });

    // Use the upload function from middleware
    const cloudinaryResult = await uploadToCloudinary(req.file.buffer, userId);

    // Update user in database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        'avatar.url': cloudinaryResult.secure_url,
        'avatar.publicId': cloudinaryResult.public_id,
        updatedAt: new Date()
      },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log("✅ User profile updated successfully");

    res.json({
      success: true,
      message: 'Avatar updated successfully',
      avatarUrl: updatedUser.avatar.url,
      user: updatedUser
    });

  } catch (error) {
    console.error('❌ Controller error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during avatar upload: ' + error.message
    });
  }
};