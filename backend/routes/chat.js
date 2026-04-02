const express = require('express');
const router = express.Router();
const ChatRoom = require('../models/ChatRoom');
const Message = require('../models/Message');
const { protect } = require('../middleware/auth');

// @route   GET /api/chat/rooms
// @desc    Get user's chat rooms  
// @access  Private
router.get('/rooms', async (req, res) => { // Public list, auth optional
  try {
    const rooms = await ChatRoom.find({ 
      participants: req.user._id,
      isActive: true 
    })
    .populate('participants', 'name email role departmentId')
    .populate('lastMessage', 'content createdAt sender')
    .populate('context.companyId', 'name')
    .populate('context.departmentId', 'name')
    .populate('context.projectId', 'name')
    .sort({ updatedAt: -1 });

    // Add unread counts for current user
    const roomsWithUnread = rooms.map(room => ({
      ...room.toObject(),
      unreadCount: room.unreadCount.get(req.user._id.toString()) || 0
    }));

    res.json({ 
      success: true, 
      count: rooms.length, 
      data: roomsWithUnread 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/chat/rooms/:roomId
// @desc    Get specific room details
// @access  Private
router.get('/rooms/:roomId', protect, async (req, res) => {
  try {
    const room = await ChatRoom.findOne({ 
      _id: req.params.roomId, 
      participants: req.user._id 
    })
    .populate('participants', 'name email role departmentId');

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.json({ success: true, data: room });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/chat/rooms
// @desc    Create new chat room
// @access  Private
router.post('/rooms', protect, async (req, res) => {
  try {
    const { participants, type = 'direct', name, context = {} } = req.body;

    // Validate participants (must include sender)
    if (!participants.includes(req.user._id.toString())) {
      return res.status(400).json({ message: 'Must include yourself as participant' });
    }

    // Check for existing 1:1 room
    if (type === 'direct' && participants.length === 2) {
      const existingRoom = await ChatRoom.findOne({
        type: 'direct',
        participants: { $size: 2, $all: participants.map(p => new mongoose.Types.ObjectId(p)) }
      });
      
      if (existingRoom) {
        return res.json({ success: true, data: existingRoom });
      }
    }

    const room = await ChatRoom.create({
      name,
      type,
      participants: participants.map(p => new mongoose.Types.ObjectId(p)),
      context,
      unreadCount: {}
    });

    const populatedRoom = await ChatRoom.findById(room._id)
      .populate('participants', 'name email role departmentId')
      .populate('context.companyId', 'name')
      .populate('context.departmentId', 'name')
      .populate('context.projectId', 'name');

    res.status(201).json({ success: true, data: populatedRoom });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/chat/rooms/:roomId/messages
// @desc    Get room message history
// @access  Private
router.get('/rooms/:roomId/messages', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const room = await ChatRoom.findOne({
      _id: req.params.roomId,
      participants: req.user._id
    });

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const messages = await Message.find({ roomId: req.params.roomId })
      .populate('sender', 'name email role avatar')
      .populate('mentionedUsers', 'name')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    // Reset unread count
    room.unreadCount.set(req.user._id.toString(), 0);
    await room.save();

    res.json({ 
      success: true, 
      count: messages.length,
      hasMore: messages.length === limit,
      data: messages.reverse() // Chronological order
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
