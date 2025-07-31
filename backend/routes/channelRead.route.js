import express from 'express';
import ChannelRead from '../models/channelRead.model.js';

const router = express.Router();

// GET: Get user's lastReadAt for a channel
router.get('/:userId/:channelId', async (req, res) => {
  const { userId, channelId } = req.params;

  try {
    const read = await ChannelRead.findOne({ user: userId, channel: channelId });
    res.json({ lastReadAt: read?.lastReadAt || null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: Update lastReadAt (called when user opens a channel)
router.post('/update', async (req, res) => {
  const { userId, channelId } = req.body;

  try {
    await ChannelRead.findOneAndUpdate(
      { user: userId, channel: channelId },
      { lastReadAt: new Date() },
      { upsert: true, new: true }
    );
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
