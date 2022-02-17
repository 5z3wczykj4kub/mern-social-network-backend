import { validationResult } from 'express-validator';
import { Op, QueryTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';
import {
  getCommentsLengthSubquery,
  getHomepagePostsQuery,
} from '../db/queries.js';
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

  // Append number of comments to the post
  const comments = await post.countComments();

  return res
    .status(200)
    .json(getPostObject({ ...post.toJSON(), comments }, author));
};

/**
 * @desc   Get homepage posts
 * @route  GET /api/posts
 * @access Private
 */
const getHomepagePostsController = async (req, res, next) => {
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
  const { cursor, limit } = req.query;

  const [[{ count }], rows] = await Promise.all([
    sequelize.query(getHomepagePostsQuery(requester.id, cursor, limit, true), {
      type: QueryTypes.SELECT,
    }),
    sequelize.query(getHomepagePostsQuery(requester.id, cursor, limit), {
      type: QueryTypes.SELECT,
    }),
  ]);

  return res.status(200).json({
    count,
    rows: rows.map((row) => getPostObject(row)),
  });
};

/**
 * @desc   Get specific user's posts
 * @route  GET /api/users/:userId/posts
 * @access Private
 */
const getPostsByUserIdController = async (req, res, next) => {
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
  const { userId } = req.params;
  const { cursor, limit } = req.query;

  // Check if user whose posts we want to see exists
  const user = await User.findOne({ where: { id: userId } });
  if (!user) {
    res.status(404);
    return next(new Error(`user with the given id (${userId}) doesn\'t exist`));
  }

  const isFriendsOrOwner = await checkIfFriendsOrOwner(requester, user);

  if (!isFriendsOrOwner) {
    res.status(403);
    return next(new Error('unauthorized to view requested posts'));
  }

  const [count, rows] = await Promise.all([
    user.countPosts({
      where: cursor && {
        id: { [Op.lt]: cursor },
      },
    }),
    user.getPosts({
      include: {
        model: User,
        attributes: ['id', 'firstName', 'lastName', 'avatar'],
      },
      attributes: [
        'id',
        'content',
        'media',
        'createdAt',
        [sequelize.literal(getCommentsLengthSubquery), 'comments'],
      ],
      where: cursor && {
        id: { [Op.lt]: cursor },
      },
      order: [['id', 'DESC']],
      limit,
    }),
  ]);

  return res.status(200).json({
    count,
    // Sequelize auto-generated mixins are quite irritating and pretty useless
    rows: rows.map((row) => ({
      id: row.id,
      content: row.content,
      media: row.media,
      comments: row.dataValues.comments,
      createdAt: row.createdAt,
      author: {
        id: row.User.id,
        firstName: row.User.firstName,
        lastName: row.User.lastName,
        avatar: row.User.avatar,
      },
    })),
  });
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

export {
  getOnePostController,
  getHomepagePostsController,
  getPostsByUserIdController,
  addPostController,
};
