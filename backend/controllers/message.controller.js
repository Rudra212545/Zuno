import Message from "../models/message.model.js"

// Create/save a new message
export const createMessage = async (req, res) => {
  try {
    const { content } = req.body;  // get content string from body
    const userId = req.user._id;   // logged in user ID from auth middleware
    const channelId = req.params.channelId;  // assuming your route is like '/channels/:channelId/messages'


    if (!userId || !channelId || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newMessage = new Message({
      user: userId,
      channel: channelId,
      content,
      timestamp: new Date(),
    });

    const savedMessage = await newMessage.save();

    // Optionally populate user and channel before sending response
    await savedMessage.populate('user', 'username avatar role');
    await savedMessage.populate('channel', 'name');

    res.status(201).json(savedMessage);
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get messages for a channel (populate user and channel info)
export const getMessagesByChannel = async (req, res) => {
  try {
    const { channelId } = req.params;

    const messages = await Message.find({ channel: channelId })
      .sort({ timestamp: 1 }) // oldest first
      .populate('user', 'username avatar role')
      .populate('channel', 'name');

    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
