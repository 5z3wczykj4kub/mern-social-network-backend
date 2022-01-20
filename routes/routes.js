import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import authRoutes from './authRoutes.js';
import postRoutes from './postRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/posts', authMiddleware, postRoutes);

export default router;
