// models/Message.js
import mongoose from 'mongoose';

const { Schema, model, Types } = mongoose;

const messageSchema = new Schema({
  user: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  channel: {
    type: Types.ObjectId,
    ref: 'Channel',
    required: true,
  },
}, {
  timestamps: true,
});

const Message = model('Message', messageSchema);

export default Message;
