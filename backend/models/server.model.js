import mongoose from 'mongoose';

const { Schema, model, Types } = mongoose;

const serverSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  iconUrl: {
    type: String,
  },
  channels: [
    {
      type: Types.ObjectId,
      ref: 'Channel',
    }
  ],
  members: [
    {
      type: Types.ObjectId,
      ref: 'User',
      default: [] // Default to empty array
    }
  ],
  userId: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Server = model('Server', serverSchema);

export default Server;
