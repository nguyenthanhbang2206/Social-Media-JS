const mongoose = require('mongoose');

const friendshipSchema = new mongoose.Schema({
  requesterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'ACCEPTED', 'DECLINED', 'BLOCKED'],
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
friendshipSchema.virtual('active').get(function() {
  return !this.deletedAt;
});

friendshipSchema.set('toJSON', { virtuals: true });
friendshipSchema.set('toObject', { virtuals: true });

// Index for soft delete
friendshipSchema.index({ deletedAt: 1 });

// Compound index for unique friendships
friendshipSchema.index({ requesterId: 1, receiverId: 1 }, { unique: true });

module.exports = mongoose.model('FriendShip', friendshipSchema);
