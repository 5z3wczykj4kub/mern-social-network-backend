import express from 'express';
import {
  addPostController,
  getHomepagePostsController,
  getOnePostController,
} from '../controllers/posts.js';
import {
  addPostValidator,
  getHomepagePostsValidator,
  getOnePostValidator,
} from '../validators/posts.js';

const router = express.Router();

router
  .get('/posts/:postId', getOnePostValidator, getOnePostController)
  .route('/posts')
  .get(getHomepagePostsValidator, getHomepagePostsController)
  .post(addPostValidator, addPostController);

export default router;
