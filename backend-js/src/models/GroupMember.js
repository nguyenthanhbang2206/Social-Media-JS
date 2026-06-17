const mongoose = require('mongoose');

const groupMemberSchema = new mongoose.Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    enum: ['ADMIN', 'MEMBER'],
    default: 'MEMBER'
  },
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED', 'LEFT'],
    default: 'PENDING'
  },
  deletedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Soft delete
groupMemberSchema.virtual('active').get(function() {
  return !this.deletedAt;
});

groupMemberSchema.set('toJSON', { virtuals: true });
groupMemberSchema.set('toObject', { virtuals: true });

// Index for soft delete
groupMemberSchema.index({ deletedAt: 1 });

// Compound index for unique group membership
groupMemberSchema.index({ groupId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('GroupMember', groupMemberSchema);
