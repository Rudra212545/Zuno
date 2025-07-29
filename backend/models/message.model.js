// models/Message.js
const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: String,
  timestamp: { type: Date, default: Date.now },
  channel: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel', required: true },
});

module.exports = mongoose.model('Message', MessageSchema);
