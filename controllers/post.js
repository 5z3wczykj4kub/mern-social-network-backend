import { validationResult } from 'express-validator';
import Post from '../models/Post.js';

export const getPostsController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { page, limit } = req.query;

  /**
   * FIXME:
   * Only get posts created by
   * your friends or yourself.
   */
  // const posts = await Post.find()
  //   .select({
  //     createdAt: 0,
  //     updatedAt: 0,
  //     __v: 0,
  //   })
  //   .populate({
  //     path: 'author',
  //     select: 'firstName lastName avatarImageUrl',
  //   });
  const posts = await Post.aggregate([
    { $project: { createdAt: 0, __v: 0 } },
  ]).populate('author');

  return res.json(posts);
};

export const addPostController = async (req, res, next) => {
  /**
   * FIXME:
   * Expected Content-Type header in the final version
   * should be multipart/form-data, because posts,
   * besides text, can also have images.
   */
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const post = new Post({
    author: req.authUser._id,
    text: req.body.text,
  });

  try {
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500);
    next(new Error('Saving post to a database failed'));
  }
};
