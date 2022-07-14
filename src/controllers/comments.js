import { validationResult } from 'express-validator';
import { Op } from 'sequelize';
import checkIfFriendsOrOwner from '../helpers/checkIfFriendsOrOwner.js';
import Comment from '../models/Comment.js';
import Post from '../models/Post.js';
import User from '../models/User.js';

/**
 * @desc   Get comments
 * @route  GET /api/posts/:postId/comments
 * @access Private
 */
const getCommentsController = async (req, res, next) => {
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
  const { cursor, limit } = req.query;

  // Check if post exists
  const post = await Post.findOne({
    attributes: ['id', 'authorId'],
    where: { id: postId },
  });

  if (!post) {
    res.status(404);
    return next(new Error(`post with the given id (${postId}) doesn\'t exist`));
  }

  /**
   * In order to get comments, we must first check
   * if the post that we're interested in
   * belongs to us or one of our friends.
   */
  const postAuthor = await User.findOne({
    attributes: ['id'],
    where: { id: post.authorId },
  });

  const isFriendsOrOwner = await checkIfFriendsOrOwner(requester, postAuthor);

  if (!isFriendsOrOwner) {
    res.status(403);
    return next(new Error("unauthorized to get this post's comments"));
  }

  // Get comments
  const comments = await Comment.findAndCountAll({
    include: {
      model: User,
      attributes: ['id', 'firstName', 'lastName', 'avatar'],
    },
    attributes: ['id', 'content'],
    where: cursor
      ? {
          postId: post.id,
          id: {
            [Op.lt]: cursor,
          },
        }
      : { postId: post.id },
    order: [['id', 'DESC']],
    limit,
  });

  comments.rows = comments.rows.map((row) => ({
    id: row.id,
    content: row.content,
    author: {
      id: row.User.id,
      firstName: row.User.firstName,
      lastName: row.User.lastName,
      avatar: row.User.avatar,
    },
  }));

  return res.status(200).json(comments);
};

/**
 * @desc   Add comment
 * @route  POST /api/posts/:postId/comments
 * @access Private
 */
const addCommentController = async (req, res, next) => {
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
  const { content } = req.body;

  // Check if post exists
  const post = await Post.findOne({
    attributes: ['authorId'],
    where: { id: postId },
  });

  if (!post) {
    res.status(404);
    return next(new Error(`post with the given id (${postId}) doesn\'t exist`));
  }

  /**
   * In order to add a comment, we must first check
   * if the post that we're about to comment
   * belongs to us or one of our friends.
   */
  const postAuthor = await User.findOne({
    attributes: ['id'],
    where: { id: post.authorId },
  });

  const isFriendsOrOwner = await checkIfFriendsOrOwner(requester, postAuthor);

  if (!isFriendsOrOwner) {
    res.status(403);
    return next(new Error('unauthorized to comment this post'));
  }

  const comment = Comment.build({ postId, content, authorId: requester.id });
  try {
    await comment.save();
  } catch (error) {
    res.status(400);
    return next(new Error('adding comment failed'));
  }

  return res.status(201).json(comment);
};

export { getCommentsController, addCommentController };
