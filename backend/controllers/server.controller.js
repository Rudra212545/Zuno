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

    console.log("🔍 Server creation request:", { name, userId, hasFile: !!file });

    if (!name || !userId) {
      return res.status(400).json({ message: 'Server name and user ID are required.' });
    }

    let iconUrl = null;

    // Handle server icon upload
    if (file) {
      try {
        const base64Image = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        const result = await cloudinary.v2.uploader.upload(base64Image, {
          folder: 'zuno/servers',
          public_id: `icon_${uuidv4()}`,
        });
        iconUrl = result.secure_url;
        console.log("✅ Server icon uploaded:", iconUrl);
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
      }
    } else {
      const encodedName = encodeURIComponent(name);
      iconUrl = `https://ui-avatars.com/api/?name=${encodedName}&background=6366F1&color=fff&bold=true`;
      console.log("✅ Generated server icon:", iconUrl);
    }

    // ✅ Create the server first
    const server = new Server({
      name,
      iconUrl: iconUrl,
      userId,
      members: [userId],
      channels: [], // Will be populated after creating channels
    });

    const savedServer = await server.save();
    console.log("✅ Server created:", savedServer._id);

    // ✅ Create default channels with ALL required fields
    const generalText = new Channel({ 
      name: 'general', 
      type: 'text', 
      server: savedServer._id,  // ✅ Required: Link to server
      createdBy: userId,        // ✅ Required: Creator
      isPrivate: false,
      description: 'General discussion',
      members: [userId],        // Add creator as member
      permissions: {
        everyone: {
          view: true,
          send: true,
          read: true
        }
      }
    });

    const generalVoice = new Channel({ 
      name: 'General Voice', 
      type: 'voice', 
      server: savedServer._id,  // ✅ Required: Link to server
      createdBy: userId,        // ✅ Required: Creator
      isPrivate: false,
      description: 'General voice chat',
      members: [userId],        // Add creator as member
      permissions: {
        everyone: {
          view: true,
          send: true,
          read: true
        }
      }
    });

    // Save channels
    const savedTextChannel = await generalText.save();
    const savedVoiceChannel = await generalVoice.save();

    console.log("✅ Channels created:", {
      text: savedTextChannel._id,
      voice: savedVoiceChannel._id
    });

    // ✅ Update server with channel IDs
    savedServer.channels = [savedTextChannel._id, savedVoiceChannel._id];
    await savedServer.save();

    // Update user document to add this server
    await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          servers: {
            server: savedServer._id,
            role: 'owner',
            joinedAt: new Date()
          }
        }
      },
      { new: true }
    );

    console.log("✅ User updated with new server");

    // Return populated server data
    const populatedServer = await Server.findById(savedServer._id)
      .populate('channels')
      .populate('members', 'username email avatar');

    res.status(201).json({ 
      message: 'Server created successfully.', 
      server: populatedServer 
    });

  } catch (error) {
    console.error('❌ Server creation failed:', error);
    
    // Enhanced error handling
    if (error.name === 'ValidationError') {
      const validationErrors = {};
      Object.keys(error.errors).forEach(key => {
        validationErrors[key] = error.errors[key].message;
      });
      
      console.log("❌ Validation errors:", validationErrors);
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: validationErrors 
      });
    }
    
    res.status(500).json({ 
      message: 'Internal server error.',
      error: error.message 
    });
  }
};

export const getAllServers = async (req, res) => {
  try {
    const userId = req.user._id;
    
    console.log('🔍 GET SERVERS REQUEST:', {
      userId: userId.toString(),
      username: req.user.username
    });

    // Find servers where user is owner OR member
    const servers = await Server.find({
      $or: [
        { userId: userId }, // User created the server (owner)
        { members: userId } // User is a member
      ]
    })
    .populate('channels')
    .populate('members', 'username avatar email')
    .sort({ createdAt: -1 });

    console.log('✅ SERVERS FOUND:', servers.length);
    
    servers.forEach((server, index) => {
      console.log(`  ${index + 1}. "${server.name}" - Owner: ${server.userId}, Members: ${server.members.length}`);
      console.log(`     Server ID: ${server._id}`);
      console.log(`     Is User Owner: ${server.userId.toString() === userId.toString()}`);
      console.log(`     Is User Member: ${server.members.some(m => m._id.toString() === userId.toString())}`);
    });

    res.json(servers);
  } catch (error) {
    console.error("❌ Error fetching servers:", error);
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