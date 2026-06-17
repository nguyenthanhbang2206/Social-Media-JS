const Post = require('../models/Post');
const Reaction = require('../models/Reaction');

// @desc    Create post
// @route   POST /api/v1/posts
// @access  Private
const createPost = async (req, res) => {
  try {
    const { content, privacy, media, groupId } = req.body;

    const post = await Post.create({
      content,
      privacy: privacy || 'PUBLIC',
      userId: req.user.id,
      ownerName: req.user.fullName,
      groupId: groupId || null,
      postType: groupId ? 'GROUP_POST' : 'USER_POST',
      media: media || []
    });

    res.status(201).json({
      message: 'Create post successfully',
      status: 201,
      data: post
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: 500,
      data: null
    });
  }
};

// @desc    Update post
// @route   PUT /api/v1/posts/:id
// @access  Private
const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: 'Post not found',
        status: 404,
        data: null
      });
    }

    if (post.userId.toString() !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        message: 'Not authorized to update this post',
        status: 403,
        data: null
      });
    }

    const { content, privacy, media } = req.body;

    if (content) post.content = content;
    if (privacy) post.privacy = privacy;
    if (media) post.media = media;

    await post.save();

    res.status(200).json({
      message: 'Update post successfully',
      status: 200,
      data: post
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: 500,
      data: null
    });
  }
};

// @desc    Get posts by user
// @route   GET /api/v1/users/:userId/posts
// @access  Private
const getPostsByUser = async (req, res) => {
  try {
    const posts = await Post.find({
      userId: req.params.userId,
      deletedAt: null,
      postType: 'USER_POST'
    })
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Get post by user successfully',
      status: 200,
      data: posts
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: 500,
      data: null
    });
  }
};

// @desc    Get all posts (news feed)
// @route   GET /api/v1/posts
// @access  Private
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({
      deletedAt: null,
      postType: 'USER_POST',
      privacy: 'PUBLIC'
    })
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Get posts successfully',
      status: 200,
      data: posts
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: 500,
      data: null
    });
  }
};

// @desc    Delete post
// @route   DELETE /api/v1/posts/:id
// @access  Private
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: 'Post not found',
        status: 404,
        data: null
      });
    }

    if (post.userId.toString() !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        message: 'Not authorized to delete this post',
        status: 403,
        data: null
      });
    }

    post.deletedAt = new Date();
    await post.save();

    res.status(200).json({
      message: 'Delete post successfully',
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

// @desc    Get post by ID
// @route   GET /api/v1/posts/:id
// @access  Private
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: 'Post not found',
        status: 404,
        data: null
      });
    }

    res.status(200).json({
      message: 'Get post successfully',
      status: 200,
      data: post
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: 500,
      data: null
    });
  }
};

// @desc    React to post
// @route   POST /api/v1/posts/:id/react
// @access  Private
const reactToPost = async (req, res) => {
  try {
    const { type } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: 'Post not found',
        status: 404,
        data: null
      });
    }

    // Check if user already reacted
    const existingReaction = await Reaction.findOne({
      postId: req.params.id,
      userId: req.user.id,
      deletedAt: null
    });

    if (existingReaction) {
      // Update reaction type
      existingReaction.type = type;
      await existingReaction.save();
    } else {
      // Create new reaction
      await Reaction.create({
        postId: req.params.id,
        userId: req.user.id,
        type
      });
      post.totalReactions += 1;
    }

    await post.save();

    res.status(200).json({
      message: 'React to post successfully',
      status: 200,
      data: post
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: 500,
      data: null
    });
  }
};

// @desc    Unreact to post
// @route   DELETE /api/v1/posts/:id/react
// @access  Private
const unreactToPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: 'Post not found',
        status: 404,
        data: null
      });
    }

    const reaction = await Reaction.findOne({
      postId: req.params.id,
      userId: req.user.id,
      deletedAt: null
    });

    if (reaction) {
      reaction.deletedAt = new Date();
      await reaction.save();
      post.totalReactions -= 1;
      await post.save();
    }

    res.status(200).json({
      message: 'Unreact to post successfully',
      status: 200,
      data: post
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
  createPost,
  updatePost,
  getPostsByUser,
  getAllPosts,
  deletePost,
  getPostById,
  reactToPost,
  unreactToPost
};
