const Block = require('../models/Block');

// @desc    Block user
// @route   POST /api/v1/blocks/:userId
// @access  Private
const blockUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;

    if (userId === req.user.id.toString()) {
      return res.status(400).json({
        message: 'Cannot block yourself',
        status: 400,
        data: null
      });
    }

    // Check if block already exists
    const existingBlock = await Block.findOne({
      blockerId: req.user.id,
      blockedId: userId,
      deletedAt: null
    });

    if (existingBlock) {
      return res.status(400).json({
        message: 'User already blocked',
        status: 400,
        data: null
      });
    }

    const block = await Block.create({
      blockerId: req.user.id,
      blockedId: userId,
      reason: reason || null
    });

    res.status(201).json({
      message: 'Block user successfully',
      status: 201,
      data: block
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: 500,
      data: null
    });
  }
};

// @desc    Unblock user
// @route   DELETE /api/v1/blocks/:userId
// @access  Private
const unblockUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const block = await Block.findOneAndUpdate(
      {
        blockerId: req.user.id,
        blockedId: userId,
        deletedAt: null
      },
      { deletedAt: new Date() }
    );

    if (!block) {
      return res.status(404).json({
        message: 'Block not found',
        status: 404,
        data: null
      });
    }

    res.status(200).json({
      message: 'Unblock user successfully',
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

// @desc    Get my blocked users
// @route   GET /api/v1/blocks
// @access  Private
const getMyBlocks = async (req, res) => {
  try {
    const blocks = await Block.find({
      blockerId: req.user.id,
      deletedAt: null
    })
      .populate('blockedId', '-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Get blocks successfully',
      status: 200,
      data: blocks
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: 500,
      data: null
    });
  }
};

// @desc    Check if block exists
// @route   GET /api/v1/blocks/exists
// @access  Private
const existsBlockBetween = async (req, res) => {
  try {
    const { userId, targetId } = req.query;

    const block = await Block.findOne({
      blockerId: userId,
      blockedId: targetId,
      deletedAt: null
    });

    const blocked = !!block;

    res.status(200).json({
      message: 'Check block successfully',
      status: 200,
      data: blocked
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
  blockUser,
  unblockUser,
  getMyBlocks,
  existsBlockBetween
};
