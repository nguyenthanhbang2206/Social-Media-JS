const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  createNotification,
  deleteByReference,
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification
} = require('../controllers/notificationController');

router.post('/', auth, createNotification);
router.delete('/', auth, deleteByReference);
router.get('/', auth, getMyNotifications);
router.get('/unread-count', auth, getUnreadCount);
router.patch('/:id/read', auth, markAsRead);
router.patch('/read-all', auth, markAllAsRead);
router.delete('/:id', auth, deleteNotification);

module.exports = router;
