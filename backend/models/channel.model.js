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
  isPrivate: {
    type: Boolean,
    default: false,
  },
  roles: {
    type: [Types.ObjectId],
    ref: 'Role',
    required: function() {
      return this.isPrivate === true;
    },
    default: undefined,
  },
}, {
  timestamps: true,
});

const Channel = model('Channel', channelSchema);

export default Channel;
