# Social Media Backend - MERN Stack

This is the backend implementation for the Social Media application using Node.js, Express, and MongoDB.

## Features

- User management (profile, search)
- Post management (create, update, delete, reactions)
- Comment system (create, update, delete, replies)
- Group management (create, update, delete, membership)
- Notification system (real-time via Socket.IO)
- Friendship management (requests, accept, refuse, unfriend)
- User blocking system
- File upload support

## Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- Socket.IO (real-time notifications)
- JWT (authentication)
- Multer (file uploads)

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file in the root directory:

```
PORT=8080
MONGODB_URI=mongodb://localhost:27017/social-media
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRE=7d
```

## Running the Server

```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### User Routes
- GET /api/v1/users - Get all users
- GET /api/v1/users/:id - Get user by ID
- GET /api/v1/users/profile - Get current user profile
- PUT /api/v1/users/profile - Update profile
- GET /api/v1/users/search - Search users

### Post Routes
- POST /api/v1/posts - Create post
- PUT /api/v1/posts/:id - Update post
- DELETE /api/v1/posts/:id - Delete post
- GET /api/v1/posts/:id - Get post by ID
- POST /api/v1/posts/:id/react - React to post
- DELETE /api/v1/posts/:id/react - Unreact to post

### Comment Routes
- POST /api/v1/posts/:postId/comments - Create comment
- GET /api/v1/posts/:postId/comments - Get comments
- PUT /api/v1/comments/:commentId - Update comment
- DELETE /api/v1/comments/:commentId - Delete comment
- POST /api/v1/comments/:commentId/reply - Reply to comment
- GET /api/v1/comments/:commentId/replies - Get replies

### Group Routes
- POST /api/v1/groups - Create group
- GET /api/v1/groups - Get all groups
- GET /api/v1/groups/:id - Get group by ID
- PUT /api/v1/groups/:id - Update group
- DELETE /api/v1/groups/:id - Delete group
- GET /api/v1/groups/search - Search groups
- GET /api/v1/groups/my-group - Get my groups

### Notification Routes
- POST /api/v1/notifications - Create notification
- DELETE /api/v1/notifications - Delete by reference
- GET /api/v1/notifications - Get my notifications
- GET /api/v1/notifications/unread-count - Get unread count
- PATCH /api/v1/notifications/:id/read - Mark as read
- PATCH /api/v1/notifications/read-all - Mark all as read
- DELETE /api/v1/notifications/:id - Delete notification

### Friendship Routes
- POST /api/v1/friend-requests/:userId - Send friend request
- DELETE /api/v1/friend-requests/:userId - Cancel request
- PUT /api/v1/friend-requests/:userId/accept - Accept friend
- PUT /api/v1/friend-requests/:userId/refuse - Refuse friend
- DELETE /api/v1/friends/:userId - Unfriend
- GET /api/v1/friends/:userId - Get friends
- GET /api/v1/friend-requests/received - Get received requests
- GET /api/v1/friends/status/:userId - Get friendship status

### Block Routes
- POST /api/v1/blocks/:userId - Block user
- DELETE /api/v1/blocks/:userId - Unblock user
- GET /api/v1/blocks - Get my blocked users
- GET /api/v1/blocks/exists - Check if block exists

## Project Structure

```
backend-js/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── userController.js
│   │   ├── postController.js
│   │   ├── commentController.js
│   │   ├── groupController.js
│   │   ├── notificationController.js
│   │   ├── friendshipController.js
│   │   └── blockController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── upload.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Post.js
│   │   ├── Comment.js
│   │   ├── Group.js
│   │   ├── Notification.js
│   │   ├── FriendShip.js
│   │   ├── Block.js
│   │   ├── GroupMember.js
│   │   ├── PostShare.js
│   │   ├── Reaction.js
│   │   └── CommentLike.js
│   ├── routes/
│   │   ├── userRoutes.js
│   │   ├── postRoutes.js
│   │   ├── commentRoutes.js
│   │   ├── groupRoutes.js
│   │   ├── notificationRoutes.js
│   │   ├── friendshipRoutes.js
│   │   └── blockRoutes.js
│   ├── services/
│   │   └── notificationService.js
│   └── utils/
│       └── apiResponse.js
├── .env
├── package.json
├── server.js
└── README.md
```
