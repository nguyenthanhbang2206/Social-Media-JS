const mongoose = require('mongoose');

const blockSchema = new mongoose.Schema({
  blockerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  blockedId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reason: {
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
blockSchema.virtual('active').get(function() {
  return !this.deletedAt;
});

blockSchema.set('toJSON', { virtuals: true });
blockSchema.set('toObject', { virtuals: true });

// Index for soft delete
blockSchema.index({ deletedAt: 1 });

// Compound index for unique blocks
blockSchema.index({ blockerId: 1, blockedId: 1 }, { unique: true });

module.exports = mongoose.model('Block', blockSchema);
