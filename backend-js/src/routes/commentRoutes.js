const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  createComment,
  getComments,
  updateComment,
  deleteComment,
  replyComment,
  getRepliesOfComment
} = require('../controllers/commentController');

router.post('/:postId/comments', auth, createComment);
router.get('/:postId/comments', auth, getComments);
router.put('/comments/:commentId', auth, updateComment);
router.delete('/comments/:commentId', auth, deleteComment);
router.post('/comments/:commentId/reply', auth, replyComment);
router.get('/comments/:commentId/replies', auth, getRepliesOfComment);

module.exports = router;
