const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  getUsers,
  getUserById,
  getProfile,
  updateProfile,
  searchUsers
} = require('../controllers/userController');

router.get('/', auth, getUsers);
router.get('/:id', auth, getUserById);
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.get('/search', auth, searchUsers);

module.exports = router;
