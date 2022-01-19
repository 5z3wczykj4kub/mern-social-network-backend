import express from 'express';
import {
  getAuthUserController,
  signInController,
  signUpController,
} from '../controllers/auth.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { signInValidator, signUpValidator } from '../validators/auth.js';

const router = express.Router();

router.post('/signup', signUpValidator, signUpController);
router.post('/signin', signInValidator, signInController);
router.get('/', authMiddleware, getAuthUserController);

export default router;
