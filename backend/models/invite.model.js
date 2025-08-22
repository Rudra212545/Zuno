import mongoose from 'mongoose';

const inviteSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  serverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Server',
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: null
  },
  maxUses: {
    type: Number,
    default: null
  },
  uses: {
    type: Number,
    default: 0
  },
  grantTempMembership: {
    type: Boolean,
    default: false
  }
});

const Invite = mongoose.model("Invite", inviteSchema);
export default Invite;
