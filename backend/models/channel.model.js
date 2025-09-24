// models/Channel.js
import mongoose from 'mongoose';

const { Schema, model, Types } = mongoose;

const channelSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ['text', 'voice'],
    required: true,
  },
  server: { // ✅ ADD THIS REQUIRED FIELD
    type: Types.ObjectId,
    ref: 'Server',
    required: true, // Each channel must belong to a server
  },
  isPrivate: {
    type: Boolean,
    default: false,
  },
  description: { // ✅ ADD DESCRIPTION FIELD (optional but useful)
    type: String,
    default: '',
  },
  members: [{ // ✅ ADD MEMBERS ARRAY (optional but useful for permissions)
    type: Types.ObjectId,
    ref: 'User',
  }],
  roles: {
    type: [Types.ObjectId],
    ref: 'Role',
    required: function() {
      return this.isPrivate === true;
    },
    default: undefined,
  },
  createdBy: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,  // Must have a creator
  },
  permissions: { // ✅ ADD PERMISSIONS (optional but useful)
    everyone: {
      view: { type: Boolean, default: true },
      send: { type: Boolean, default: true },
      read: { type: Boolean, default: true },
    }
  }
}, {
  timestamps: true,
});

const Channel = model('Channel', channelSchema);

export default Channel;
