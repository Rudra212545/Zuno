// models/message.model.js - Add reactions field
import mongoose from 'mongoose';

const { Schema, model, Types } = mongoose;

const reactionSchema = new Schema({
  emoji: {
    type: String,
    required: true
  },
  users: [{
    type: Types.ObjectId,
    ref: 'User'
  }],
  count: {
    type: Number,
    default: 0
  }
});

const messageSchema = new Schema({
  author: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  channel: {
    type: Types.ObjectId,
    ref: 'Channel',
    required: true,
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'file', 'voice'],
    default: 'text'
  },
  // ✅ Add reactions field
  reactions: [reactionSchema],
  timestamp: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true,
});

// Index for better query performance
messageSchema.index({ channel: 1, createdAt: -1 });

const Message = model('Message', messageSchema);

export default Message;
