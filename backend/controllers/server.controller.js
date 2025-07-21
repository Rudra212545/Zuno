import Server from '../models/server.model.js';
import Channel from '../models/channel.model.js';
import cloudinary from 'cloudinary';
import { v4 as uuidv4 } from 'uuid';

// Cloudinary config (use a separate config file if preferred)
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  timeout: 60000, // Optional: increase timeout to 60 seconds
});

export const createServer = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user?.id; // Make sure req.user exists from auth middleware
    const file = req.file;

    if (!name || !userId) {
      return res.status(400).json({ message: 'Server name and user ID are required.' });
    }

    let iconUrl = null;

    // 🔼 Upload image to Cloudinary if file is present
    if (file) {
      const base64Image = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

      const result = await cloudinary.v2.uploader.upload(base64Image, {
        folder: 'zuno/servers',
        public_id: `icon_${uuidv4()}`,
      });

      iconUrl = result.secure_url;
    }

    // 📦 Create default text & voice channels
    const generalText = new Channel({ name: 'general', type: 'text', isPrivate: false });
    const generalVoice = new Channel({ name: 'general', type: 'voice', isPrivate: false });

    await generalText.save();
    await generalVoice.save();

    // 🛠️ Create the server
    const server = new Server({
      name,
      iconUrl: iconUrl,
      owner: userId,
      members: [userId],
      channels: [generalText._id, generalVoice._id],
    });

    await server.save();

    res.status(201).json({ message: 'Server created successfully.', server });
  } catch (error) {
    console.error('Server creation failed:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const getAllServers = async (req, res) => {
  try {
    const servers = await Server.find(); // fetch all servers from DB
    res.json(servers);
  } catch (error) {
    console.error("Error fetching servers:", error);
    res.status(500).json({ message: "Failed to fetch servers" });
  }
};