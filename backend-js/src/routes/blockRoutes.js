const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  blockUser,
  unblockUser,
  getMyBlocks,
  existsBlockBetween
} = require('../controllers/blockController');

router.post('/:userId', auth, blockUser);
router.delete('/:userId', auth, unblockUser);
router.get('/', auth, getMyBlocks);
router.get('/exists', auth, existsBlockBetween);

module.exports = router;
