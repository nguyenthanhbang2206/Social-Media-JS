const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  createPost,
  updatePost,
  getPostsByUser,
  getAllPosts,
  deletePost,
  getPostById,
  reactToPost,
  unreactToPost
} = require('../controllers/postController');

router.post('/', auth, createPost);
router.put('/:id', auth, updatePost);
router.delete('/:id', auth, deletePost);
router.get('/:id', auth, getPostById);
router.post('/:id/react', auth, reactToPost);
router.delete('/:id/react', auth, unreactToPost);

module.exports = router;
