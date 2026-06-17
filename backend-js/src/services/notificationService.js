const Notification = require('../models/Notification');

// Create notification
const createNotification = async (recipientId, actorId, type, referenceId, message) => {
  try {
    const notification = await Notification.create({
      recipientId,
      actorId,
      type,
      referenceId,
      message
    });
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Delete notification by reference
const deleteByReference = async (actorId, referenceId, type) => {
  try {
    await Notification.findOneAndUpdate(
      { actorId, referenceId, type, deletedAt: null },
      { deletedAt: new Date() }
    );
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};

module.exports = {
  createNotification,
  deleteByReference
};
