import Comment from '../models/Comment.js';
import checkIfFriendsOrOwner from '../helpers/checkIfFriendsOrOwner.js';
import Post from '../models/Post.js';
import { validationResult } from 'express-validator';
import User from '../models/User.js';

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
   * In orderd to add a comment, we must first check
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

export { addCommentController };
