import express from 'express';
import authMiddleware from '../middleware/auth.js';
import authRoutes from './auth.js';
import usersRoutes from './users.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', authMiddleware, usersRoutes);

export default router;
