const mongoose = require('mongoose');

const postMediaSchema = new mongoose.Schema({
  mediaUrl: String,
  mediaType: {
    type: String,
    enum: ['IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT']
  },
  uploadOrder: Number
});

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  privacy: {
    type: String,
    enum: ['PUBLIC', 'FRIENDS', 'ONLY_ME'],
    default: 'PUBLIC'
  },
  totalReactions: {
    type: Number,
    default: 0
  },
  totalComments: {
    type: Number,
    default: 0
  },
  totalShares: {
    type: Number,
    default: 0
  },
  isApproved: {
    type: Boolean,
    default: true
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ownerName: String,
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group'
  },
  postType: {
    type: String,
    enum: ['USER_POST', 'GROUP_POST'],
    default: 'USER_POST'
  },
  media: [postMediaSchema],
  deletedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Soft delete
postSchema.virtual('active').get(function() {
  return !this.deletedAt;
});

postSchema.set('toJSON', { virtuals: true });
postSchema.set('toObject', { virtuals: true });

// Index for soft delete
postSchema.index({ deletedAt: 1 });

module.exports = mongoose.model('Post', postSchema);
