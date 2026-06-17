const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private
const getUsers = async (req, res) => {
  try {
    const users = await User.find({ enabled: true, accountLocked: false })
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Get users successfully',
      status: 200,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: 500,
      data: null
    });
  }
};

// @desc    Get user by ID
// @route   GET /api/v1/users/:id
// @access  Private
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        status: 404,
        data: null
      });
    }

    res.status(200).json({
      message: 'Get user by id successfully',
      status: 200,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: 500,
      data: null
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/v1/users/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    res.status(200).json({
      message: 'Get profile successfully',
      status: 200,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: 500,
      data: null
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/v1/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { fullName, gender, dateOfBirth, coverPhoto, avatar } = req.body;

    const user = await User.findById(req.user.id);

    if (fullName) user.fullName = fullName;
    if (gender) user.gender = gender;
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;
    if (coverPhoto) user.coverPhoto = coverPhoto;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.status(200).json({
      message: 'Update profile successfully',
      status: 200,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: 500,
      data: null
    });
  }
};

// @desc    Search users
// @route   GET /api/v1/users/search
// @access  Private
const searchUsers = async (req, res) => {
  try {
    const { keyword } = req.query;

    const users = await User.find({
      $or: [
        { fullName: { $regex: keyword, $options: 'i' } },
        { username: { $regex: keyword, $options: 'i' } },
        { email: { $regex: keyword, $options: 'i' } }
      ],
      enabled: true,
      accountLocked: false
    })
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Search users successfully',
      status: 200,
      data: users
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
  getUsers,
  getUserById,
  getProfile,
  updateProfile,
  searchUsers
};
