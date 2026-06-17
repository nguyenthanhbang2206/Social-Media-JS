const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  actorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['REACT', 'COMMENT', 'FRIEND_REQUEST', 'FRIEND_ACCEPT', 'POST_SHARE', 'MENTION', 'GROUP_INVITE', 'GROUP_POST', 'GROUP_REQUESTED', 'GROUP_APPROVED'],
    required: true
  },
  referenceId: {
    type: mongoose.Schema.Types.ObjectId
  },
  message: {
    type: String,
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Soft delete
notificationSchema.virtual('active').get(function() {
  return !this.deletedAt;
});

notificationSchema.set('toJSON', { virtuals: true });
notificationSchema.set('toObject', { virtuals: true });

// Index for soft delete and queries
notificationSchema.index({ recipientId: 1, isRead: 1 });
notificationSchema.index({ deletedAt: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
