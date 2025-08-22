import Invite from '../models/invite.model.js';
import Server from '../models/server.model.js';
import User from '../models/user.model.js';
import { v4 as uuidv4 } from 'uuid';

// Helper function to convert expiration time
const getExpirationTime = (expiresAfter) => {
  const timeMap = {
    '30min': 30 * 60 * 1000,
    '1hour': 60 * 60 * 1000,
    '6hours': 6 * 60 * 60 * 1000,
    '12hours': 12 * 60 * 60 * 1000,
    '1day': 24 * 60 * 60 * 1000,
    '7days': 7 * 24 * 60 * 60 * 1000,
    '30days': 30 * 24 * 60 * 60 * 1000,
    'never': null
  };
  return timeMap[expiresAfter] || null;
};

// Get all invites for a server
export const getInvites = async (req, res) => {
  try {
    const { serverId } = req.params;
    
    const server = await Server.findById(serverId);
    if (!server) {
      return res.status(404).json({ message: 'Server not found' });
    }
    
    const invites = await Invite.find({ 
      serverId,
      $or: [
        { expiresAt: null },
        { expiresAt: { $gt: new Date() } }
      ]
    }).populate('createdBy', 'username');
    
    res.status(200).json(invites);
  } catch (error) {
    console.error('Error fetching invites:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create new invite
export const createInvite = async (req, res) => {
  console.log('🚀 CreateInvite route hit!');
  console.log('📨 Request params:', req.params);
  console.log('📦 Request body:', req.body);
  
  try {
    const { serverId } = req.params;
    const { createdBy, expiresAfter, maxUses, grantTempMembership } = req.body;
    
    // Validate serverId
    if (!serverId) {
      return res.status(400).json({ message: 'Server ID is required' });
    }
    
    // Fix createdBy - use from request body or authenticated user
    const validCreatedBy = createdBy || req.user?._id;
    if (!validCreatedBy) {
      console.log('❌ Missing createdBy field');
      return res.status(400).json({ message: 'createdBy is required. Please provide user ID.' });
    }
    
    // Fix maxUses - properly handle the conversion
    let parsedMaxUses = null;
    if (maxUses && maxUses !== 'unlimited') {
      parsedMaxUses = parseInt(maxUses, 10);
      if (isNaN(parsedMaxUses)) {
        console.log('❌ Invalid maxUses value:', maxUses);
        return res.status(400).json({ message: 'maxUses must be a number or "unlimited"' });
      }
    }
    
    console.log('✅ Processed values:', {
      serverId,
      createdBy: validCreatedBy,
      maxUses: parsedMaxUses,
      expiresAfter
    });
    
    // Validate server exists
    const server = await Server.findById(serverId);
    if (!server) {
      return res.status(404).json({ message: 'Server not found' });
    }
    
    // Generate unique code
    let code;
    let isUnique = false;
    let attempts = 0;
    
    while (!isUnique && attempts < 10) {
      code = uuidv4().substring(0, 8).toUpperCase();
      const existingInvite = await Invite.findOne({ code });
      if (!existingInvite) {
        isUnique = true;
      }
      attempts++;
    }
    
    if (!isUnique) {
      return res.status(500).json({ message: 'Failed to generate unique invite code' });
    }
    
    // Calculate expiration
    const expirationMs = getExpirationTime(expiresAfter);
    const expiresAt = expirationMs ? new Date(Date.now() + expirationMs) : null;
    
    // Create invite with validated data
    const inviteData = {
      code,
      serverId,
      createdBy: validCreatedBy, // ✅ Properly set
      expiresAt,
      maxUses: parsedMaxUses, // ✅ Properly parsed
      grantTempMembership: grantTempMembership || false
    };
    
    console.log('💾 Creating invite with data:', inviteData);
    const invite = new Invite(inviteData);
    
    await invite.save();
    await invite.populate('createdBy', 'username');
    
    console.log('✅ Invite created successfully:', invite.code);
    res.status(201).json(invite);
  } catch (error) {
    console.error('❌ Error in createInvite:', error);
    res.status(500).json({ 
      message: 'Error creating invite',
      error: error.message 
    });
  }
};


// Revoke/delete invite
export const revokeInvite = async (req, res) => {
  try {
    const { inviteId } = req.params;
    
    const invite = await Invite.findByIdAndDelete(inviteId);
    
    if (!invite) {
      return res.status(404).json({ message: 'Invite not found' });
    }
    
    console.log(`Revoked invite: ${invite.code}`);
    res.status(204).send();
  } catch (error) {
    console.error('Error revoking invite:', error);
    res.status(500).json({ message: 'Error revoking invite' });
  }
};

// Get invite info by code
export const getInviteInfo = async (req, res) => {
  try {
    const { code } = req.params;
    
    const invite = await Invite.findOne({ code })
      .populate('serverId', 'name iconUrl')
      .populate('createdBy', 'username');
    
    if (!invite) {
      return res.status(404).json({ message: 'Invite not found or expired' });
    }
    
    if (invite.expiresAt && new Date(invite.expiresAt) <= new Date()) {
      await Invite.findByIdAndDelete(invite._id);
      return res.status(410).json({ message: 'Invite expired' });
    }
    
    if (invite.maxUses && invite.uses >= invite.maxUses) {
      return res.status(410).json({ message: 'Invite usage limit reached' });
    }
    
    res.json({
      code: invite.code,
      server: {
        id: invite.serverId._id,
        name: invite.serverId.name,
        iconUrl: invite.serverId.iconUrl
      },
      expiresAt: invite.expiresAt,
      uses: invite.uses,
      maxUses: invite.maxUses,
      grantTempMembership: invite.grantTempMembership,
      createdBy: invite.createdBy.username
    });
  } catch (error) {
    console.error('Error getting invite info:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Use invite to join server
export const useInvite = async (req, res) => {
  try {
    console.log('🎯 UseInvite route hit!');
    console.log('👤 req.user:', req.user); // Debug log
    
    const { code } = req.params;
    
    // ✅ Extra safety check
    if (!req.user || !req.user._id) {
      console.log('❌ Authentication failed - no user in request');
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const userId = req.user._id;
    console.log('✅ Authenticated user ID:', userId);
    
    const invite = await Invite.findOne({ code });
    
    if (!invite) {
      return res.status(404).json({ message: 'Invite not found' });
    }
    
    // Check expiration
    if (invite.expiresAt && new Date(invite.expiresAt) <= new Date()) {
      await Invite.findByIdAndDelete(invite._id);
      return res.status(410).json({ message: 'Invite expired' });
    }
    
    // Check usage limits
    if (invite.maxUses && invite.uses >= invite.maxUses) {
      return res.status(410).json({ message: 'Invite usage limit reached' });
    }
    
    // Check if user already in server
    const server = await Server.findById(invite.serverId);
    if (server.members.includes(userId)) {
      return res.status(400).json({ message: 'You are already a member of this server' });
    }
    
    // Add user to server
    await Server.findByIdAndUpdate(
      invite.serverId,
      { $push: { members: userId } }
    );
    
    // Add server to user's servers list
    await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          servers: {
            server: invite.serverId,
            role: invite.grantTempMembership ? 'temp' : 'member',
            joinedAt: new Date()
          }
        }
      }
    );
    
    // Increment invite usage
    invite.uses += 1;
    await invite.save();
    
    // Delete if max uses reached
    if (invite.maxUses && invite.uses >= invite.maxUses) {
      await Invite.findByIdAndDelete(invite._id);
    }
    
    console.log(`✅ User ${userId} joined server ${invite.serverId} using invite ${code}`);
    
    res.json({
      message: 'Successfully joined server',
      serverId: invite.serverId,
      grantTempMembership: invite.grantTempMembership
    });
    
  } catch (error) {
    console.error('❌ Error using invite:', error);
    res.status(500).json({ message: 'Error joining server' });
  }
};

