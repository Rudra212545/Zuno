import mongoose from 'mongoose';

const { Schema, model, Types } = mongoose;

const channelReadSchema = new Schema({
  user: { type: Types.ObjectId, ref: 'User', required: true },
  channel: { type: Types.ObjectId, ref: 'Channel', required: true },
  lastReadAt: { type: Date, default: null },
}, { timestamps: true });

channelReadSchema.index({ user: 1, channel: 1 }, { unique: true });

const ChannelRead = model('ChannelRead', channelReadSchema);
export default ChannelRead;
