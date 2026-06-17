const FriendShip = require('../models/FriendShip');
const User = require('../models/User');

// @desc    Send friend request
// @route   POST /api/v1/friend-requests/:userId
// @access  Private
const sendFriendRequest = async (req, res) => {
  try {
    const { userId } = req.params;

    if (userId === req.user.id.toString()) {
      return res.status(400).json({
        message: 'Cannot send friend request to yourself',
        status: 400,
        data: null
      });
    }

    // Check if friendship already exists
    const existingFriendship = await FriendShip.findOne({
      $or: [
        { requesterId: req.user.id, receiverId: userId },
        { requesterId: userId, receiverId: req.user.id }
      ],
      deletedAt: null
    });

    if (existingFriendship) {
      return res.status(400).json({
        message: 'Friend request already exists',
        status: 400,
        data: null
      });
    }

    const friendship = await FriendShip.create({
      requesterId: req.user.id,
      receiverId: userId,
      status: 'PENDING'
    });

    // Create notification
    const Notification = require('../models/Notification');
    await Notification.create({
      recipientId: userId,
      actorId: req.user.id,
      type: 'FRIEND_REQUEST',
      referenceId: friendship._id,
      message: `${req.user.fullName} sent you a friend request`
    });

    res.status(201).json({
      message: 'Send request successfully',
      status: 201,
      data: friendship
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: 500,
      data: null
    });
  }
};

// @desc    Cancel friend request
// @route   DELETE /api/v1/friend-requests/:userId
// @access  Private
const cancelFriendRequest = async (req, res) => {
  try {
    const { userId } = req.params;

    const friendship = await FriendShip.findOneAndUpdate(
      {
        requesterId: req.user.id,
        receiverId: userId,
        status: 'PENDING',
        deletedAt: null
      },
      { deletedAt: new Date() }
    );

    if (!friendship) {
      return res.status(404).json({
        message: 'Friend request not found',
        status: 404,
        data: null
      });
    }

    res.status(200).json({
      message: 'Delete request successfully',
      status: 200,
      data: null
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: 500,
      data: null
    });
  }
};

// @desc    Accept friend request
// @route   PUT /api/v1/friend-requests/:userId/accept
// @access  Private
const acceptFriend = async (req, res) => {
  try {
    const { userId } = req.params;

    const friendship = await FriendShip.findOneAndUpdate(
      {
        requesterId: userId,
        receiverId: req.user.id,
        status: 'PENDING',
        deletedAt: null
      },
      { status: 'ACCEPTED' },
      { new: true }
    );

    if (!friendship) {
      return res.status(404).json({
        message: 'Friend request not found',
        status: 404,
        data: null
      });
    }

    // Create notification
    const Notification = require('../models/Notification');
    await Notification.create({
      recipientId: userId,
      actorId: req.user.id,
      type: 'FRIEND_ACCEPT',
      referenceId: friendship._id,
      message: `${req.user.fullName} accepted your friend request`
    });

    res.status(200).json({
      message: 'Accept friend successfully',
      status: 200,
      data: friendship
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: 500,
      data: null
    });
  }
};

// @desc    Refuse friend request
// @route   PUT /api/v1/friend-requests/:userId/refuse
// @access  Private
const refuseFriend = async (req, res) => {
  try {
    const { userId } = req.params;

    const friendship = await FriendShip.findOneAndUpdate(
      {
        requesterId: userId,
        receiverId: req.user.id,
        status: 'PENDING',
        deletedAt: null
      },
      { status: 'DECLINED' },
      { new: true }
    );

    if (!friendship) {
      return res.status(404).json({
        message: 'Friend request not found',
        status: 404,
        data: null
      });
    }

    res.status(200).json({
      message: 'Refuse friend successfully',
      status: 200,
      data: null
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: 500,
      data: null
    });
  }
};

// @desc    Unfriend user
// @route   DELETE /api/v1/friends/:userId
// @access  Private
const unfriend = async (req, res) => {
  try {
    const { userId } = req.params;

    await FriendShip.findOneAndUpdate(
      {
        $or: [
          { requesterId: req.user.id, receiverId: userId },
          { requesterId: userId, receiverId: req.user.id }
        ],
        status: 'ACCEPTED',
        deletedAt: null
      },
      { deletedAt: new Date() }
    );

    res.status(200).json({
      message: 'Delete friend successfully',
      status: 200,
      data: null
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: 500,
      data: null
    });
  }
};

// @desc    Get friends of a user
// @route   GET /api/v1/friends/:userId
// @access  Private
const getFriends = async (req, res) => {
  try {
    const { userId } = req.params;

    const friendships = await FriendShip.find({
      $or: [
        { requesterId: userId, status: 'ACCEPTED' },
        { receiverId: userId, status: 'ACCEPTED' }
      ],
      deletedAt: null
    });

    const friendIds = friendships.map(f => 
      f.requesterId.toString() === userId.toString() ? f.receiverId : f.requesterId
    );

    const friends = await User.find({
      _id: { $in: friendIds },
      enabled: true,
      accountLocked: false
    }).select('-password');

    res.status(200).json({
      message: 'Get friends successfully',
      status: 200,
      data: friends
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: 500,
      data: null
    });
  }
};

// @desc    Get received friend requests
// @route   GET /api/v1/friend-requests/received
// @access  Private
const getFriendRequestsReceived = async (req, res) => {
  try {
    const friendships = await FriendShip.find({
      receiverId: req.user.id,
      status: 'PENDING',
      deletedAt: null
    }).sort({ createdAt: -1 });

    const requesterIds = friendships.map(f => f.requesterId);
    const users = await User.find({
      _id: { $in: requesterIds }
    }).select('-password');

    const result = friendships.map(f => ({
      ...f.toObject(),
      sender: users.find(u => u._id.toString() === f.requesterId.toString())
    }));

    res.status(200).json({
      message: 'Get friends request received successfully',
      status: 200,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: 500,
      data: null
    });
  }
};

// @desc    Get friendship status
// @route   GET /api/v1/friends/status/:userId
// @access  Private
const getFriendStatus = async (req, res) => {
  try {
    const { userId } = req.params;

    const friendship = await FriendShip.findOne({
      $or: [
        { requesterId: req.user.id, receiverId: userId },
        { requesterId: userId, receiverId: req.user.id }
      ],
      deletedAt: null
    });

    res.status(200).json({
      message: 'Get friend status successfully',
      status: 200,
      data: friendship || null
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: 500,
      data: null
    });
  }
};

module.exports = {
  sendFriendRequest,
  cancelFriendRequest,
  acceptFriend,
  refuseFriend,
  unfriend,
  getFriends,
  getFriendRequestsReceived,
  getFriendStatus
};
