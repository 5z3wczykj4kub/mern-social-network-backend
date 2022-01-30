import express from 'express';
import {
  addPostController,
  getOnePostController,
} from '../controllers/posts.js';
import { addPostValidator, getOnePostValidator } from '../validators/posts.js';

const router = express.Router();

router
  .get('/posts/:postId', getOnePostValidator, getOnePostController)
  .route('/posts')
  .post(addPostValidator, addPostController);

export default router;
