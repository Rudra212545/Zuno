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
      ref: 'Channel', // Reference to the Channel model
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Server = model('Server', serverSchema);

export default Server;
