import express from 'express';
import {
  addCommentController,
  getCommentsController,
} from '../controllers/comments.js';
import {
  addCommentValidator,
  getCommentsValidator,
} from '../validators/comments.js';

const router = express.Router();

router
  .route('/:postId/comments')
  .get(getCommentsValidator, getCommentsController)
  .post(addCommentValidator, addCommentController);

export default router;
