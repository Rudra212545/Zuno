// controllers/channel.controller.js
import Channel from '../models/channel.model.js';
import Server from '../models/server.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const createChannel = asyncHandler(async (req, res, next) => {
  try {
    const { name, type = 'text', description = '', isPrivate = false } = req.body;
    const { serverId } = req.params; // ✅ Get serverId from route params
    const userId = req.user._id;

    console.log("🔍 Channel creation request:", {
      name,
      type,
      serverId, // ✅ This was missing!
      userId,
      description,
      isPrivate
    });

    // Validate required fields
    if (!name) {
      throw new ApiError(400, "Channel name is required");
    }

    if (!serverId) {
      throw new ApiError(400, "Server ID is required");
    }

    // Check if server exists and user has permission
    const server = await Server.findById(serverId);
    if (!server) {
      throw new ApiError(404, "Server not found");
    }

    // Check if user is a member of the server (basic permission check)
    const isMember = server.members.includes(userId) || server.userId.toString() === userId.toString();
    if (!isMember) {
      throw new ApiError(403, "You don't have permission to create channels in this server");
    }

    // Check if channel name already exists in this server
    const existingChannel = await Channel.findOne({ 
      server: serverId, 
      name: name.toLowerCase().trim() 
    });
    
    if (existingChannel) {
      throw new ApiError(409, "A channel with this name already exists in this server");
    }

    // ✅ Create channel with ALL required fields
    const newChannel = new Channel({
      name: name.toLowerCase().trim(),
      type,
      server: serverId,        // ✅ Required: Server ID
      createdBy: userId,       // ✅ Required: Creator
      description: description?.trim() || '',
      isPrivate,
      members: [userId],       // Add creator as member
      permissions: {
        everyone: {
          view: !isPrivate,    // Private channels can't be viewed by everyone
          send: !isPrivate,
          read: !isPrivate
        }
      }
    });

    const savedChannel = await newChannel.save();
    console.log("✅ Channel created:", savedChannel._id);

    // Add channel to server's channels array
    await Server.findByIdAndUpdate(
      serverId,
      { $push: { channels: savedChannel._id } },
      { new: true }
    );

    // Populate the channel with creator info
    const populatedChannel = await Channel.findById(savedChannel._id)
      .populate('createdBy', 'username email avatar')
      .populate('server', 'name iconUrl');

    res.status(201).json(
      new ApiResponse(201, populatedChannel, "Channel created successfully")
    );

  } catch (error) {
    console.error('❌ Error creating channel:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = {};
      Object.keys(error.errors).forEach(key => {
        validationErrors[key] = error.errors[key].message;
      });
      
      throw new ApiError(400, "Channel validation failed", validationErrors);
    }
    
    throw error;
  }
});

// Get channels by server ID
export const getChannelsByServerId = async (req, res) => {
  try {
    const { serverId } = req.params;
    const userId = req.user._id;

    // Check if user has access to this server
    const server = await Server.findById(serverId);
    if (!server) {
      return res.status(404).json({ message: 'Server not found' });
    }

    const isMember = server.members.includes(userId) || server.userId.toString() === userId.toString();
    if (!isMember) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Find channels that user can access
    const channels = await Channel.find({ 
      server: serverId,
      $or: [
        { isPrivate: false }, // Public channels
        { members: userId },  // Private channels user is member of
        { createdBy: userId } // Channels created by user
      ]
    })
    .populate('createdBy', 'username avatar')
    .sort({ createdAt: 1 });

    res.json(channels);
  } catch (error) {
    console.error('Error fetching channels:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete channel
export const deleteChannel = asyncHandler(async (req, res, next) => {
  try {
    const { channelId } = req.params;
    const userId = req.user._id;

    const channel = await Channel.findById(channelId).populate('server');
    if (!channel) {
      throw new ApiError(404, "Channel not found");
    }

    // Check permissions (owner or creator can delete)
    const isOwner = channel.server.userId.toString() === userId.toString();
    const isCreator = channel.createdBy.toString() === userId.toString();
    
    if (!isOwner && !isCreator) {
      throw new ApiError(403, "You don't have permission to delete this channel");
    }

    // Remove channel from server's channels array
    await Server.findByIdAndUpdate(
      channel.server._id,
      { $pull: { channels: channelId } }
    );

    // Delete the channel
    await Channel.findByIdAndDelete(channelId);

    res.json(new ApiResponse(200, null, "Channel deleted successfully"));
  } catch (error) {
    console.error('Error deleting channel:', error);
    throw error;
  }
});
