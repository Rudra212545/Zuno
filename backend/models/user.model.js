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
    required: function () {
      return !this.googleId; // Password is required only if googleId is NOT present
    },
    minlength: 6
  },
  googleId: {
    type: String,
    default: null
  },
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
  // Status and Presence
  status: {
    type: String,
    enum: ['online', 'away', 'busy', 'invisible', 'offline'],
    default: 'online'
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  isOnline: {
    type: Boolean,
    default: false
  },
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
    }
  },

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

  // Social Features
  friends: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
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
  blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  // Servers and Channels
  servers: [{
    server: { type: mongoose.Schema.Types.ObjectId, ref: 'Server' },
    joinedAt: { type: Date, default: Date.now },
    role: {
      type: String,
      enum: ['owner', 'admin', 'moderator', 'member'],
      default: 'member'
    }
  }],

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
    earnedAt: { type: Date, default: Date.now },
    description: String
  }],
  achievements: [{
    name: String,
    description: String,
    icon: String,
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

  // Call History
  callHistory: [{
    type: {
      type: String,
      enum: ['voice', 'video', 'screen_share']
    },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    duration: { type: Number, default: 0 },
    startedAt: { type: Date, default: Date.now },
    endedAt: Date,
    server: { type: mongoose.Schema.Types.ObjectId, ref: 'Server', default: null },
    channel: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel', default: null }
  }],

  // Device and Session Management
  devices: [{
    deviceId: String,
    deviceName: String,
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

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
userSchema.index({ 'servers.server': 1 });
userSchema.index({ isOnline: 1 });
userSchema.index({ status: 1 });
userSchema.index({ createdAt: -1 });

// Virtual for accepted friend count
userSchema.virtual('friendCount').get(function () {
  return (this.friends || []).filter(friend => friend.status === 'accepted').length;
});

// Pre-save password hashing
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Access token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
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
