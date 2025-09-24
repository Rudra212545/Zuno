// controllers/invite.controller.js
import Invite from '../models/invite.model.js';
import Server from '../models/server.model.js';
import User from '../models/user.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

// @desc    Create server invite
// @route   POST /api/v1/invite/:serverId
// @access  Private (Server members only)
export const createInvite = asyncHandler(async (req, res) => {
  const { serverId } = req.params;
  const userId = req.user._id;
  const { maxUses = null, expiresIn = 604800 } = req.body; // Default 7 days

  // Check if server exists
  const server = await Server.findById(serverId);
  if (!server) {
    throw new ApiError(404, 'Server not found');
  }

  // Check if user is member of server
  const isMember = server.members.includes(userId) || server.userId.toString() === userId.toString();
  if (!isMember) {
    throw new ApiError(403, 'You must be a member of this server to create invites');
  }

  // Create invite
  const invite = new Invite({
    server: serverId,
    inviter: userId,
    maxUses: maxUses,
    expiresAt: new Date(Date.now() + expiresIn * 1000)
  });

  await invite.save();
  await invite.populate('server', 'name iconUrl');
  await invite.populate('inviter', 'username avatar');

  res.status(201).json(
    new ApiResponse(201, {
      invite: {
        code: invite.code,
        url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/invite/${invite.code}`,
        server: invite.server,
        inviter: invite.inviter,
        expiresAt: invite.expiresAt,
        maxUses: invite.maxUses,
        uses: invite.uses
      }
    }, 'Invite created successfully')
  );
});

// @desc    Get invite information
// @route   GET /api/v1/invite/:inviteCode
// @access  Public
export const getInviteInfo = asyncHandler(async (req, res) => {
  const { inviteCode } = req.params;

  const invite = await Invite.findOne({
    code: inviteCode,
    isActive: true,
    expiresAt: { $gt: new Date() }
  })
  .populate('server', 'name iconUrl memberCount')
  .populate('inviter', 'username avatar');

  if (!invite) {
    throw new ApiError(404, 'Invite not found or expired');
  }

  // Check if invite has reached max uses
  if (invite.maxUses && invite.uses >= invite.maxUses) {
    throw new ApiError(400, 'Invite has reached maximum uses');
  }

  // Get member count for server
  const server = await Server.findById(invite.server._id);
  const memberCount = server ? server.members.length : 0;

  res.json(
    new ApiResponse(200, {
      invite: {
        code: invite.code,
        server: {
          ...invite.server.toObject(),
          memberCount
        },
        inviter: invite.inviter,
        expiresAt: invite.expiresAt,
        uses: invite.uses,
        maxUses: invite.maxUses
      }
    }, 'Invite information retrieved')
  );
});

// @desc    Join server via invite
// @route   POST /api/v1/invite/join/:inviteCode
// @access  Private
export const joinServerByInvite = asyncHandler(async (req, res) => {
  const { inviteCode } = req.params;
  const userId = req.user._id;

  const invite = await Invite.findOne({
    code: inviteCode,
    isActive: true,
    expiresAt: { $gt: new Date() }
  }).populate('server');

  if (!invite) {
    throw new ApiError(404, 'Invalid or expired invite');
  }

  // Check max uses
  if (invite.maxUses && invite.uses >= invite.maxUses) {
    throw new ApiError(400, 'Invite has reached maximum uses');
  }

  const server = invite.server;

  // Check if user is already a member
  if (server.members.includes(userId)) {
    throw new ApiError(400, 'You are already a member of this server');
  }

  // Add user to server
  server.members.push(userId);
  await server.save();

  // Update user's servers list
  await User.findByIdAndUpdate(userId, {
    $push: {
      servers: {
        server: server._id,
        role: 'member',
        joinedAt: new Date()
      }
    }
  });

  // Increment invite uses
  invite.uses += 1;
  await invite.save();

  // Get updated server with channels
  const updatedServer = await Server.findById(server._id)
    .populate('channels')
    .populate('members', 'username avatar email');

  res.json(
    new ApiResponse(200, {
      server: updatedServer,
      message: `Successfully joined ${server.name}`
    }, 'Successfully joined server')
  );
});

// @desc    Get server invites
// @route   GET /api/v1/invite/server/:serverId
// @access  Private (Server members only)
export const getServerInvites = asyncHandler(async (req, res) => {
  const { serverId } = req.params;
  const userId = req.user._id;

  // Check if server exists and user is member
  const server = await Server.findById(serverId);
  if (!server) {
    throw new ApiError(404, 'Server not found');
  }

  const isMember = server.members.includes(userId) || server.userId.toString() === userId.toString();
  if (!isMember) {
    throw new ApiError(403, 'Access denied');
  }

  const invites = await Invite.find({
    server: serverId,
    isActive: true,
    expiresAt: { $gt: new Date() }
  })
  .populate('inviter', 'username avatar')
  .sort({ createdAt: -1 });

  res.json(
    new ApiResponse(200, { invites }, 'Server invites retrieved')
  );
});

// @desc    Revoke invite
// @route   DELETE /api/v1/invite/:inviteCode
// @access  Private (Invite creator or server owner)
export const revokeInvite = asyncHandler(async (req, res) => {
  const { inviteCode } = req.params;
  const userId = req.user._id;

  const invite = await Invite.findOne({ code: inviteCode }).populate('server');
  if (!invite) {
    throw new ApiError(404, 'Invite not found');
  }

  // Check if user can revoke (invite creator or server owner)
  const isCreator = invite.inviter.toString() === userId.toString();
  const isServerOwner = invite.server.userId.toString() === userId.toString();

  if (!isCreator && !isServerOwner) {
    throw new ApiError(403, 'You can only revoke your own invites');
  }

  invite.isActive = false;
  await invite.save();

  res.json(
    new ApiResponse(200, null, 'Invite revoked successfully')
  );
});
