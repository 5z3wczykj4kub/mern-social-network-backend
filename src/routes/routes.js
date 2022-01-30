import express from 'express';
import authMiddleware from '../middleware/auth.js';
import authRoutes from './auth.js';
import friendsRoutes from './friends.js';
import usersRoutes from './users.js';
import postsRoutes from './posts.js';

const router = express.Router();

// Authenticaton
router.use('/auth', authRoutes);
// Users
router.use('/users', authMiddleware, usersRoutes);
// Friends
router.use('/users', authMiddleware, friendsRoutes);
// Posts
router.use('/', authMiddleware, postsRoutes);

export default router;
