import express from 'express';
import { addPostController, getPostsController } from '../controllers/post.js';
import { addPostValidator, getPostsValidator } from '../validators/post.js';

const router = express.Router();

router
  .route('/')
  .get(getPostsValidator, getPostsController)
  .post(addPostValidator, addPostController);

export default router;
