// models/invite.model.js
import mongoose from 'mongoose';

const inviteSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    default: () => {
      // Generate a random invite code (8 characters)
      return Math.random().toString(36).substring(2, 10);
    }
  },
  server: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Server',
    required: true
  },
  inviter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
  },
  maxUses: {
    type: Number,
    default: null // null means unlimited uses
  },
  uses: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for faster queries
inviteSchema.index({ code: 1 });
inviteSchema.index({ server: 1 });
inviteSchema.index({ expiresAt: 1 });

// Auto-delete expired invites (optional)
inviteSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('Invite', inviteSchema);
