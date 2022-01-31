import express from 'express';
import {
  addPostController,
  getHomepagePostsController,
  getOnePostController,
  getPostsByUserIdController,
} from '../controllers/posts.js';
import {
  addPostValidator,
  getHomepagePostsValidator,
  getOnePostValidator,
  getPostsByUserIdValidator,
} from '../validators/posts.js';

const router = express.Router();

router
  .get(
    '/users/:userId/posts',
    getPostsByUserIdValidator,
    getPostsByUserIdController
  )
  .get('/posts/:postId', getOnePostValidator, getOnePostController)
  .route('/posts')
  .get(getHomepagePostsValidator, getHomepagePostsController)
  .post(addPostValidator, addPostController);

export default router;
