const mongoose = require('mongoose');

const reactionSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
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
reactionSchema.virtual('active').get(function() {
  return !this.deletedAt;
});

reactionSchema.set('toJSON', { virtuals: true });
reactionSchema.set('toObject', { virtuals: true });

// Index for soft delete
reactionSchema.index({ deletedAt: 1 });

// Compound index for unique reactions
reactionSchema.index({ postId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Reaction', reactionSchema);
