const Comment = require('../models/Comment');
const Post = require('../models/Post');

// @desc    Create comment
// @route   POST /api/v1/posts/:postId/comments
// @access  Private
const createComment = async (req, res) => {
  try {
    const { content, parentCommentId } = req.body;
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({
        message: 'Post not found',
        status: 404,
        data: null
      });
    }

    const comment = await Comment.create({
      content,
      userId: req.user.id,
      postId: req.params.postId,
      parentCommentId: parentCommentId || null
    });

    post.totalComments += 1;
    await post.save();

    res.status(201).json({
      message: 'Comment successfully',
      status: 201,
      data: comment
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: 500,
      data: null
    });
  }
};

// @desc    Get comments for post
// @route   GET /api/v1/posts/:postId/comments
// @access  Private
const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({
      postId: req.params.postId,
      parentCommentId: null,
      deletedAt: null
    })
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Get comments successfully',
      status: 200,
      data: comments
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: 500,
      data: null
    });
  }
};

// @desc    Update comment
// @route   PUT /api/v1/comments/:commentId
// @access  Private
const updateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({
        message: 'Comment not found',
        status: 404,
        data: null
      });
    }

    if (comment.userId.toString() !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        message: 'Not authorized to update this comment',
        status: 403,
        data: null
      });
    }

    const { content } = req.body;
    if (content) comment.content = content;

    await comment.save();

    res.status(200).json({
      message: 'Update comment successfully',
      status: 200,
      data: comment
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: 500,
      data: null
    });
  }
};

// @desc    Delete comment
// @route   DELETE /api/v1/comments/:commentId
// @access  Private
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({
        message: 'Comment not found',
        status: 404,
        data: null
      });
    }

    if (comment.userId.toString() !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        message: 'Not authorized to delete this comment',
        status: 403,
        data: null
      });
    }

    comment.deletedAt = new Date();
    await comment.save();

    const post = await Post.findById(comment.postId);
    if (post) {
      post.totalComments -= 1;
      await post.save();
    }

    res.status(200).json({
      message: 'Delete comment successfully',
      status: 200,
      data: null
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: 500,
      data: null
    });
  }
};

// @desc    Reply to comment
// @route   POST /api/v1/comments/:commentId/reply
// @access  Private
const replyComment = async (req, res) => {
  try {
    const { content } = req.body;
    const parentComment = await Comment.findById(req.params.commentId);

    if (!parentComment) {
      return res.status(404).json({
        message: 'Comment not found',
        status: 404,
        data: null
      });
    }

    const comment = await Comment.create({
      content,
      userId: req.user.id,
      postId: parentComment.postId,
      parentCommentId: req.params.commentId
    });

    res.status(201).json({
      message: 'Reply comment successfully',
      status: 201,
      data: comment
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: 500,
      data: null
    });
  }
};

// @desc    Get replies to comment
// @route   GET /api/v1/comments/:commentId/replies
// @access  Private
const getRepliesOfComment = async (req, res) => {
  try {
    const comments = await Comment.find({
      parentCommentId: req.params.commentId,
      deletedAt: null
    })
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Get replies comment successfully',
      status: 200,
      data: comments
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: 500,
      data: null
    });
  }
};

module.exports = {
  createComment,
  getComments,
  updateComment,
  deleteComment,
  replyComment,
  getRepliesOfComment
};
