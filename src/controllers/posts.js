import { validationResult } from 'express-validator';
import checkIfFriendsOrOwner from '../helpers/checkIfFriendsOrOwner.js';
import getPostObject from '../helpers/getPostObject.js';
import Post from '../models/Post.js';
import User from '../models/User.js';

/**
 * @desc   Get one post
 * @route  GET /api/posts/:postId
 * @access Private
 */
const getOnePostController = async (req, res, next) => {
  // Express-validator boilerplate
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({
      errors: errors.array().map((error) => ({
        message: error.msg,
        param: error.param,
      })),
    });

  const requester = req.user;
  const { postId } = req.params;

  // Check if post exists
  const post = await Post.findOne({
    attributes: ['id', 'authorId', 'content', 'media', 'createdAt'],
    where: { id: postId },
  });

  if (!post) {
    res.status(404);
    return next(new Error(`post with the given id (${postId}) doesn\'t exist`));
  }

  /**
   * Check if we are authorized to view the post.
   * We can only see the it if:
   * 1. We are the author of the post.
   * 2. The author is our friend.
   */

  /**
   * Assume that the author of the post will always exist.
   * If the user deletes the account,
   * then all related to him/her data should be purged.
   */
  const author = await User.findOne({ where: { id: post.authorId } });

  const isFriendsOrOwner = await checkIfFriendsOrOwner(requester, author);

  if (!isFriendsOrOwner) {
    res.status(403);
    return next(new Error('unauthorized to view requested post'));
  }

  return res.status(200).json(getPostObject(post, author));
};

/**
 * @desc   Add post
 * @route  POST /api/posts
 * @access Private
 */
const addPostController = async (req, res, next) => {
  // Express-validator boilerplate
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({
      errors: errors.array().map((error) => ({
        message: error.msg,
        param: error.param,
      })),
    });

  const author = req.user;
  const { content } = req.body;

  const post = Post.build({ content, authorId: author.id });

  try {
    await post.save();
  } catch (error) {
    res.status(400);
    return next(new Error('post creation failed'));
  }

  return res.status(201).json(getPostObject(post, author));
};

export { getOnePostController, addPostController };
