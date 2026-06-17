const mongoose = require('mongoose');

const postShareSchema = new mongoose.Schema({
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
  content: {
    type: String
  },
  deletedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Soft delete
postShareSchema.virtual('active').get(function() {
  return !this.deletedAt;
});

postShareSchema.set('toJSON', { virtuals: true });
postShareSchema.set('toObject', { virtuals: true });

// Index for soft delete
postShareSchema.index({ deletedAt: 1 });

// Compound index for unique shares
postShareSchema.index({ postId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('PostShare', postShareSchema);
