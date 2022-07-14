import express from 'express';
import authMiddleware from '../middleware/auth.js';
import authRoutes from './auth.js';
import friendRoutes from './friends.js';
import userRoutes from './users.js';
import postRoutes from './posts.js';
import commentRoutes from './comments.js';

const router = express.Router();

// Authentication
router.use('/auth', authRoutes);
// Users
router.use('/users', authMiddleware, userRoutes);
// Friends
router.use('/users', authMiddleware, friendRoutes);
// Posts
router.use('/', authMiddleware, postRoutes);
// Comments
router.use('/posts', authMiddleware, commentRoutes);

export default router;
