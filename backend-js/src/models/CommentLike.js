const mongoose = require('mongoose');

const commentLikeSchema = new mongoose.Schema({
  commentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['LIKE', 'LOVE', 'HAHA', 'WOW', 'SAD', 'ANGRY'],
    required: true
  },
  deletedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Soft delete
commentLikeSchema.virtual('active').get(function() {
  return !this.deletedAt;
});

commentLikeSchema.set('toJSON', { virtuals: true });
commentLikeSchema.set('toObject', { virtuals: true });

// Index for soft delete
commentLikeSchema.index({ deletedAt: 1 });

// Compound index for unique comment likes
commentLikeSchema.index({ commentId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('CommentLike', commentLikeSchema);
