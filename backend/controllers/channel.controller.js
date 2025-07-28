import Channel from '../models/channel.model.js';
import Server from '../models/server.model.js';

export const createChannel = async (req, res) => {
  try {
    const { serverId } = req.params; // from URL param
    const { name, type, isPrivate, roles } = req.body;
    const userId = req.user._id; // logged in user ID from auth middleware

    if (!name || !type || !serverId) {
      return res.status(400).json({ message: 'Name, type, and serverId are required.' });
    }

    // Create new channel document with createdBy
    const newChannel = await Channel.create({
      name,
      type,
      isPrivate: isPrivate || false,
      roles: isPrivate ? roles : undefined,
      createdBy: userId,
    });

    // Add channel ID to server's channels array
    await Server.findByIdAndUpdate(serverId, {
      $push: { channels: newChannel._id },
    });

    return res.status(201).json(newChannel);
  } catch (error) {
    console.error('Error creating channel:', error);
    return res.status(500).json({ message: 'Failed to create channel', error: error.message });
  }
};
