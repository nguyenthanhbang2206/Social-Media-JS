const Group = require('../models/Group');
const GroupMember = require('../models/GroupMember');

// @desc    Create group
// @route   POST /api/v1/groups
// @access  Private
const createGroup = async (req, res) => {
  try {
    const { name, description, groupImage, coverImage, privacy } = req.body;

    const group = await Group.create({
      name,
      description,
      groupImage,
      coverImage,
      privacy: privacy || 'PUBLIC',
      creatorId: req.user.id
    });

    // Add creator as admin
    await GroupMember.create({
      groupId: group._id,
      userId: req.user.id,
      role: 'ADMIN',
      status: 'APPROVED'
    });

    res.status(201).json({
      message: 'Create group successfully',
      status: 201,
      data: group
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: 500,
      data: null
    });
  }
};

// @desc    Get all groups
// @route   GET /api/v1/groups
// @access  Private
const getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find({ deletedAt: null })
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Get all groups successfully',
      status: 200,
      data: groups
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: 500,
      data: null
    });
  }
};

// @desc    Get group by ID
// @route   GET /api/v1/groups/:id
// @access  Private
const getGroupById = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({
        message: 'Group not found',
        status: 404,
        data: null
      });
    }

    res.status(200).json({
      message: 'Get group by id successfully',
      status: 200,
      data: group
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: 500,
      data: null
    });
  }
};

// @desc    Update group
// @route   PUT /api/v1/groups/:id
// @access  Private
const updateGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({
        message: 'Group not found',
        status: 404,
        data: null
      });
    }

    if (group.creatorId.toString() !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        message: 'Not authorized to update this group',
        status: 403,
        data: null
      });
    }

    const { name, description, groupImage, coverImage, privacy } = req.body;

    if (name) group.name = name;
    if (description) group.description = description;
    if (groupImage) group.groupImage = groupImage;
    if (coverImage) group.coverImage = coverImage;
    if (privacy) group.privacy = privacy;

    await group.save();

    res.status(200).json({
      message: 'Update group successfully',
      status: 200,
      data: group
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: 500,
      data: null
    });
  }
};

// @desc    Delete group
// @route   DELETE /api/v1/groups/:id
// @access  Private
const deleteGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({
        message: 'Group not found',
        status: 404,
        data: null
      });
    }

    if (group.creatorId.toString() !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        message: 'Not authorized to delete this group',
        status: 403,
        data: null
      });
    }

    group.deletedAt = new Date();
    await group.save();

    res.status(200).json({
      message: 'Delete group successfully',
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

// @desc    Search groups
// @route   GET /api/v1/groups/search
// @access  Private
const searchGroups = async (req, res) => {
  try {
    const { keyword } = req.query;

    const groups = await Group.find({
      $or: [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ],
      deletedAt: null
    })
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Search group successfully',
      status: 200,
      data: groups
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: 500,
      data: null
    });
  }
};

// @desc    Get my groups
// @route   GET /api/v1/groups/my-group
// @access  Private
const getMyGroups = async (req, res) => {
  try {
    const groupMembers = await GroupMember.find({
      userId: req.user.id,
      status: 'APPROVED',
      deletedAt: null
    });

    const groupIds = groupMembers.map(gm => gm.groupId);
    const groups = await Group.find({
      _id: { $in: groupIds },
      deletedAt: null
    });

    res.status(200).json({
      message: 'Get my groups successfully',
      status: 200,
      data: groups
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
  createGroup,
  getAllGroups,
  getGroupById,
  updateGroup,
  deleteGroup,
  searchGroups,
  getMyGroups
};
