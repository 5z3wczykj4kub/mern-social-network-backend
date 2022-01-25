import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import authRoutes from './authRoutes.js';
import usersRoutes from './usersRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', authMiddleware, usersRoutes);

export default router;
