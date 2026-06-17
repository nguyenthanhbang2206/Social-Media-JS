const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        message: 'No authentication token, access denied',
        status: 401,
        data: null
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({
        message: 'User not found',
        status: 401,
        data: null
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      message: 'Token is not valid',
      status: 401,
      data: null
    });
  }
};

const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {});
    
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({
        message: 'Access denied. Admin only.',
        status: 403,
        data: null
      });
    }
    
    next();
  } catch (error) {
    res.status(401).json({
      message: 'Authentication failed',
      status: 401,
      data: null
    });
  }
};

module.exports = { auth, adminAuth };
