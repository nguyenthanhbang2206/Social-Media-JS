const Notification = require('../models/Notification');

// @desc    Create notification
// @route   POST /api/v1/notifications
// @access  Private
const createNotification = async (req, res) => {
  try {
    const { recipientId, actorId, type, referenceId, message } = req.body;

    const notification = await Notification.create({
      recipientId,
      actorId,
      type,
      referenceId,
      message
    });

    // Emit real-time notification via Socket.IO
    const io = req.app.get('io');
    io.to(`user-${recipientId}`).emit('notification', notification);

    res.status(201).json({
      message: 'Notification created successfully',
      status: 201,
      data: notification
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: 500,
      data: null
    });
  }
};

// @desc    Delete notification by reference
// @route   DELETE /api/v1/notifications
// @access  Private
const deleteByReference = async (req, res) => {
  try {
    const { actorId, referenceId, type } = req.query;

    const notification = await Notification.findOneAndUpdate(
      { actorId, referenceId, type, deletedAt: null },
      { deletedAt: new Date() }
    );

    res.status(200).json({
      message: 'Notification deleted successfully',
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

// @desc    Get my notifications
// @route   GET /api/v1/notifications
// @access  Private
const getMyNotifications = async (req, res) => {
  try {
    const { page = 0, size = 20 } = req.query;

    const notifications = await Notification.find({
      recipientId: req.user.id,
      deletedAt: null
    })
      .sort({ createdAt: -1 })
      .skip(parseInt(page) * parseInt(size))
      .limit(parseInt(size));

    const total = await Notification.countDocuments({
      recipientId: req.user.id,
      deletedAt: null
    });

    res.status(200).json({
      message: 'Get notifications successfully',
      status: 200,
      data: {
        content: notifications,
        totalElements: total,
        totalPages: Math.ceil(total / size),
        size: parseInt(size),
        number: parseInt(page)
      }
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: 500,
      data: null
    });
  }
};

// @desc    Get unread count
// @route   GET /api/v1/notifications/unread-count
// @access  Private
const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      recipientId: req.user.id,
      isRead: false,
      deletedAt: null
    });

    res.status(200).json({
      message: 'Get unread count successfully',
      status: 200,
      data: { unreadCount: count }
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: 500,
      data: null
    });
  }
};

// @desc    Mark notification as read
// @route   PATCH /api/v1/notifications/:id/read
// @access  Private
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipientId: req.user.id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        message: 'Notification not found',
        status: 404,
        data: null
      });
    }

    res.status(200).json({
      message: 'Notification marked as read',
      status: 200,
      data: notification
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: 500,
      data: null
    });
  }
};

// @desc    Mark all notifications as read
// @route   PATCH /api/v1/notifications/read-all
// @access  Private
const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipientId: req.user.id, isRead: false },
      { isRead: true }
    );

    res.status(200).json({
      message: 'All notifications marked as read',
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

// @desc    Delete notification
// @route   DELETE /api/v1/notifications/:id
// @access  Private
const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipientId: req.user.id },
      { deletedAt: new Date() }
    );

    if (!notification) {
      return res.status(404).json({
        message: 'Notification not found',
        status: 404,
        data: null
      });
    }

    res.status(200).json({
      message: 'Notification deleted successfully',
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

module.exports = {
  createNotification,
  deleteByReference,
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification
};
