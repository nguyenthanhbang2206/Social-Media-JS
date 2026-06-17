const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  groupImage: {
    type: String
  },
  coverImage: {
    type: String
  },
  privacy: {
    type: String,
    enum: ['PUBLIC', 'PRIVATE'],
    default: 'PUBLIC'
  },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
groupSchema.virtual('active').get(function() {
  return !this.deletedAt;
});

groupSchema.set('toJSON', { virtuals: true });
groupSchema.set('toObject', { virtuals: true });

// Index for soft delete
groupSchema.index({ deletedAt: 1 });

module.exports = mongoose.model('Group', groupSchema);
