const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  createGroup,
  getAllGroups,
  getGroupById,
  updateGroup,
  deleteGroup,
  searchGroups,
  getMyGroups
} = require('../controllers/groupController');

router.post('/', auth, createGroup);
router.get('/', auth, getAllGroups);
router.get('/search', auth, searchGroups);
router.get('/my-group', auth, getMyGroups);
router.get('/:id', auth, getGroupById);
router.put('/:id', auth, updateGroup);
router.delete('/:id', auth, deleteGroup);

module.exports = router;
