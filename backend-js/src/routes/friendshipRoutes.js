const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  sendFriendRequest,
  cancelFriendRequest,
  acceptFriend,
  refuseFriend,
  unfriend,
  getFriends,
  getFriendRequestsReceived,
  getFriendStatus
} = require('../controllers/friendshipController');

router.post('/:userId', auth, sendFriendRequest);
router.delete('/:userId', auth, cancelFriendRequest);
router.put('/:userId/accept', auth, acceptFriend);
router.put('/:userId/refuse', auth, refuseFriend);
router.delete('/friends/:userId', auth, unfriend);
router.get('/friends/:userId', auth, getFriends);
router.get('/received', auth, getFriendRequestsReceived);
router.get('/status/:userId', auth, getFriendStatus);

module.exports = router;
