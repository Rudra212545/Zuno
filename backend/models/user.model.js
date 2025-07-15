import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
  // Basic Information
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
    match: /^[a-zA-Z0-9_-]+$/
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  password: {
    type: String,
<<<<<<< HEAD
    required: true,
    minlength: 6
  },
  displayName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  
=======
    required: function () {
      return !this.googleId; // Password is required only if googleId is NOT present
    },
    minlength: 6
  },
  googleId: {
    type: String,
    default: null
  },
>>>>>>> b321080 (pushed)
  // Profile Information
  avatar: {
    url: {
      type: String,
      default: null
    },
    publicId: {
      type: String,
      default: null
    }
  },
  bio: {
    type: String,
    maxlength: 500,
    default: ''
  },
  pronouns: {
    type: String,
    maxlength: 20,
    default: ''
  },
<<<<<<< HEAD
  
=======

>>>>>>> b321080 (pushed)
  // Status and Presence
  status: {
    type: String,
    enum: ['online', 'away', 'busy', 'invisible', 'offline'],
    default: 'offline'
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  isOnline: {
    type: Boolean,
    default: false
  },
<<<<<<< HEAD
  
=======

>>>>>>> b321080 (pushed)
  // Account Settings
  isVerified: {
    type: Boolean,
    default: false
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  phoneNumber: {
    type: String,
    default: null
  },
  phoneVerified: {
    type: Boolean,
    default: false
  },
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  twoFactorSecret: {
    type: String,
    default: null
  },
<<<<<<< HEAD
  
=======

>>>>>>> b321080 (pushed)
  // Privacy Settings
  privacySettings: {
    showEmail: {
      type: Boolean,
      default: false
    },
    showPhone: {
      type: Boolean,
      default: false
    },
    allowDirectMessages: {
      type: String,
      enum: ['everyone', 'friends', 'none'],
      default: 'friends'
    },
    allowFriendRequests: {
      type: Boolean,
      default: true
    },
    showOnlineStatus: {
      type: Boolean,
      default: true
<<<<<<< HEAD
    },
  },
  
=======
    }
  },

>>>>>>> b321080 (pushed)
  // Video/Voice Settings
  videoSettings: {
    defaultCamera: {
      type: String,
      default: 'default'
    },
    defaultMicrophone: {
      type: String,
      default: 'default'
    },
    defaultSpeaker: {
      type: String,
      default: 'default'
    },
    autoJoinVoice: {
      type: Boolean,
      default: false
    },
    pushToTalk: {
      type: Boolean,
      default: false
    },
    pushToTalkKey: {
      type: String,
      default: 'Space'
    },
    noiseSuppression: {
      type: Boolean,
      default: true
    },
    echoCancellation: {
      type: Boolean,
      default: true
    },
    autoGainControl: {
      type: Boolean,
      default: true
    },
    videoQuality: {
      type: String,
      enum: ['low', 'medium', 'high', 'auto'],
      default: 'auto'
    }
  },
<<<<<<< HEAD
  
  // Notification Settings
  notificationSettings: {
    desktop: {
      type: Boolean,
      default: true
    },
    mobile: {
      type: Boolean,
      default: true
    },
    email: {
      type: Boolean,
      default: false
    },
    sounds: {
      type: Boolean,
      default: true
    },
    mentions: {
      type: Boolean,
      default: true
    },
    directMessages: {
      type: Boolean,
      default: true
    },
    friendRequests: {
      type: Boolean,
      default: true
    },
    eventReminders: {
      type: Boolean,
      default: true
    },
    callNotifications: {
      type: Boolean,
      default: true
    }
  },
  
=======

  // Notification Settings
  notificationSettings: {
    desktop: { type: Boolean, default: true },
    mobile: { type: Boolean, default: true },
    email: { type: Boolean, default: false },
    sounds: { type: Boolean, default: true },
    mentions: { type: Boolean, default: true },
    directMessages: { type: Boolean, default: true },
    friendRequests: { type: Boolean, default: true },
    eventReminders: { type: Boolean, default: true },
    callNotifications: { type: Boolean, default: true }
  },

>>>>>>> b321080 (pushed)
  // Language and Localization
  language: {
    type: String,
    default: 'en',
    enum: ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh', 'ar', 'hi']
  },
  timezone: {
    type: String,
    default: 'UTC'
  },
  autoTranslate: {
    type: Boolean,
    default: false
  },
  preferredTranslationLanguage: {
    type: String,
    default: 'en'
  },
<<<<<<< HEAD
  
  // Social Features
  friends: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
=======

  // Social Features
  friends: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
>>>>>>> b321080 (pushed)
    status: {
      type: String,
      enum: ['pending', 'accepted', 'blocked'],
      default: 'pending'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
<<<<<<< HEAD
  blockedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Servers and Channels
  servers: [{
    server: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Server'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
=======
  blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  // Servers and Channels
  servers: [{
    server: { type: mongoose.Schema.Types.ObjectId, ref: 'Server' },
    joinedAt: { type: Date, default: Date.now },
>>>>>>> b321080 (pushed)
    role: {
      type: String,
      enum: ['owner', 'admin', 'moderator', 'member'],
      default: 'member'
<<<<<<< HEAD
    },
  }],
  
=======
    }
  }],

>>>>>>> b321080 (pushed)
  // Achievements and Badges
  badges: [{
    type: {
      type: String,
      enum: [
        'early_adopter', 'verified', 'developer', 'moderator', 'supporter',
        'event_organizer', 'translator', 'community_builder', 'gamer',
        'content_creator', 'helper', 'bug_hunter', 'beta_tester'
      ]
    },
<<<<<<< HEAD
    earnedAt: {
      type: Date,
      default: Date.now
    },
=======
    earnedAt: { type: Date, default: Date.now },
>>>>>>> b321080 (pushed)
    description: String
  }],
  achievements: [{
    name: String,
    description: String,
    icon: String,
<<<<<<< HEAD
    unlockedAt: {
      type: Date,
      default: Date.now
    },
    progress: {
      current: {
        type: Number,
        default: 0
      },
      total: {
        type: Number,
        default: 1
      }
    }
  }],
  
  // Activity and Statistics
  statistics: {
    messagesCount: {
      type: Number,
      default: 0
    },
    voiceMinutes: {
      type: Number,
      default: 0
    },
    videoMinutes: {
      type: Number,
      default: 0
    },
    eventsCreated: {
      type: Number,
      default: 0
    },
    eventsAttended: {
      type: Number,
      default: 0
    },
    serversJoined: {
      type: Number,
      default: 0
    },
    friendsCount: {
      type: Number,
      default: 0
    }
  },
  
=======
    unlockedAt: { type: Date, default: Date.now },
    progress: {
      current: { type: Number, default: 0 },
      total: { type: Number, default: 1 }
    }
  }],

  // Activity and Statistics
  statistics: {
    messagesCount: { type: Number, default: 0 },
    voiceMinutes: { type: Number, default: 0 },
    videoMinutes: { type: Number, default: 0 },
    eventsCreated: { type: Number, default: 0 },
    eventsAttended: { type: Number, default: 0 },
    serversJoined: { type: Number, default: 0 },
    friendsCount: { type: Number, default: 0 }
  },

>>>>>>> b321080 (pushed)
  // Call History
  callHistory: [{
    type: {
      type: String,
      enum: ['voice', 'video', 'screen_share']
    },
<<<<<<< HEAD
    participants: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    duration: {
      type: Number, // in seconds
      default: 0
    },
    startedAt: {
      type: Date,
      default: Date.now
    },
    endedAt: Date,
    server: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Server',
      default: null
    },
    channel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Channel',
      default: null
    }
  }],
  
=======
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    duration: { type: Number, default: 0 },
    startedAt: { type: Date, default: Date.now },
    endedAt: Date,
    server: { type: mongoose.Schema.Types.ObjectId, ref: 'Server', default: null },
    channel: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel', default: null }
  }],

>>>>>>> b321080 (pushed)
  // Device and Session Management
  devices: [{
    deviceId: String,
    deviceName: String,
<<<<<<< HEAD
    deviceType: {
      type: String,
      enum: ['desktop', 'mobile', 'tablet', 'web']
    },
    lastUsed: {
      type: Date,
      default: Date.now
    },
    isActive: {
      type: Boolean,
      default: false
    },
    pushToken: String // For mobile notifications
  }],
  
  // Security and Moderation
  warnings: [{
    reason: String,
    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    issuedAt: {
      type: Date,
      default: Date.now
    },
    server: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Server'
    }
  }],
  bans: [{
    server: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Server'
    },
    reason: String,
    bannedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    bannedAt: {
      type: Date,
      default: Date.now
    },
    expiresAt: Date,
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  
  // Account Status
  isActive: {
    type: Boolean,
    default: true
  },
  isSuspended: {
    type: Boolean,
    default: false
  },
  suspensionReason: String,
  suspendedUntil: Date
=======
    deviceType: { type: String, enum: ['desktop', 'mobile', 'tablet', 'web'] },
    lastUsed: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: false },
    pushToken: String
  }],

  // Security and Moderation
  warnings: [{
    reason: String,
    issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    issuedAt: { type: Date, default: Date.now },
    server: { type: mongoose.Schema.Types.ObjectId, ref: 'Server' }
  }],
  bans: [{
    server: { type: mongoose.Schema.Types.ObjectId, ref: 'Server' },
    reason: String,
    bannedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    bannedAt: { type: Date, default: Date.now },
    expiresAt: Date,
    isActive: { type: Boolean, default: true }
  }],

  // Account Status
  isActive: { type: Boolean, default: true },
  isSuspended: { type: Boolean, default: false },
  suspensionReason: String,
  suspendedUntil: Date

>>>>>>> b321080 (pushed)
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

<<<<<<< HEAD
// Indexes for better performance
=======
// Indexes
>>>>>>> b321080 (pushed)
userSchema.index({ 'servers.server': 1 });
userSchema.index({ isOnline: 1 });
userSchema.index({ status: 1 });
userSchema.index({ createdAt: -1 });

<<<<<<< HEAD
// Virtual for friend count
userSchema.virtual('friendCount').get(function() {
  return this.friends.filter(friend => friend.status === 'accepted').length;
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
=======
// Virtual for accepted friend count
userSchema.virtual('friendCount').get(function () {
  return this.friends.filter(friend => friend.status === 'accepted').length;
});

// Pre-save password hashing
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
>>>>>>> b321080 (pushed)
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

<<<<<<< HEAD
// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to generate access token
userSchema.methods.generateAccessToken = function() {
=======
// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Access token
userSchema.methods.generateAccessToken = function () {
>>>>>>> b321080 (pushed)
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
<<<<<<< HEAD
      displayName: this.displayName
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
  );
};

// Method to generate refresh token
userSchema.methods.generateRefreshToken = function() {
  return jwt.sign(
    {
      _id: this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
  );
};
const User = mongoose.model('User', userSchema);
export default User;
=======
      displayName: this.username
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

// Refresh token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

const User = mongoose.model('User', userSchema);
export default User;
>>>>>>> b321080 (pushed)
