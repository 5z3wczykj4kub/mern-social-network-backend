import express from 'express';
import authMiddleware from '../middleware/auth.js';
import authRoutes from './auth.js';
import usersRoutes from './users.js';
import friendRoutes from './friends.js';

const router = express.Router();

// Authenticaton routes
router.use('/auth', authRoutes);
// User search and profile fetching routes
router.use('/users', authMiddleware, usersRoutes);
// Friend requests routes
router.use('/users', authMiddleware, friendRoutes);

export default router;
