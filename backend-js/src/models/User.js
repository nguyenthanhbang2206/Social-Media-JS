const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    select: false
  },
  fullName: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
  },
  gender: {
    type: String,
    enum: ['MALE', 'FEMALE', 'OTHER'],
    default: 'OTHER'
  },
  role: {
    type: String,
    enum: ['ADMIN', 'USER'],
    default: 'USER'
  },
  dateOfBirth: {
    type: Date
  },
  coverPhoto: {
    type: String
  },
  keycloakId: {
    type: String,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  accountLocked: {
    type: Boolean,
    default: false
  },
  enabled: {
    type: Boolean,
    default: true
  },
  emailVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Soft delete
userSchema.virtual('active').get(function() {
  return !this.deletedAt;
});

userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('User', userSchema);
