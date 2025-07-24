import Server from '../models/server.model.js';
import Channel from '../models/channel.model.js';
import User from '../models/user.model.js';
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
    const userId = req.user?._id;
    const file = req.file;

    if (!name || !userId) {
      return res.status(400).json({ message: 'Server name and user ID are required.' });
    }

    let iconUrl = null;

    if (file) {
      try {
        const base64Image = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        const result = await cloudinary.v2.uploader.upload(base64Image, {
          folder: 'zuno/servers',
          public_id: `icon_${uuidv4()}`,
        });
        iconUrl = result.secure_url;
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
      }
    } else {
      const encodedName = encodeURIComponent(name);
      iconUrl = `https://ui-avatars.com/api/?name=${encodedName}&background=6366F1&color=fff&bold=true`;
    }

    const generalText = new Channel({ name: 'general', type: 'text', isPrivate: false });
    const generalVoice = new Channel({ name: 'general', type: 'voice', isPrivate: false });

    await generalText.save();
    await generalVoice.save();

    const server = new Server({
      name,
      iconUrl: iconUrl,
      userId,
      members: [userId],
      channels: [generalText._id, generalVoice._id],
    });

    await server.save();

    // Update user document to add this server
    await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          servers: {
            server: server._id,
            role: 'owner',
            joinedAt: new Date()
          }
        }
      },
      { new: true }
    );

    res.status(201).json({ message: 'Server created successfully.', server });
  } catch (error) {
    console.error('Server creation failed:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};


export const getAllServers = async (req, res) => {
  try {
    const servers = await Server.find({ userId: req.user._id });
    res.json(servers);
  } catch (error) {
    console.error("Error fetching servers:", error);
    res.status(500).json({ message: "Failed to fetch servers" });
  }
};

export const getServerInfo = async(req,res)=>{
  try {
    const { id } = req.params;
    const serverInfo = await Server.findOne({ _id: id })

    if(!serverInfo){
      return res.status(404).json({ message: 'Server info not found' });
    }
    
    res.json({
      serverName: serverInfo.name,
      serverIconUrl: serverInfo.iconUrl,
    });


  } catch (error) {
    console.error('Error fetching server info:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getChannelsByServerId = async (req, res) => {
  try {
    const serverId = req.params.id;

    // Find the server and populate the 'channels' field with actual channel docs
    const server = await Server.findById(serverId).populate('channels');

    if (!server) {
      return res.status(404).json({ message: 'Server not found' });
    }

    // server.channels now contains full channel documents
    res.json(server.channels);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};