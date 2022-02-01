import express from 'express';
import { addCommentController } from '../controllers/comments.js';
import { addCommentValidator } from '../validators/comments.js';

const router = express.Router();

router
  .route('/:postId/comments')
  .post(addCommentValidator, addCommentController);

export default router;
