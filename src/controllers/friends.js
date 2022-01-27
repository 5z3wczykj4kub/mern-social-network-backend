import Friend from '../models/Friend.js';
import User from '../models/User.js';
import { Op } from 'sequelize';
import { validationResult } from 'express-validator';

/**
 * @desc   Send friend request
 * @route  POST /api/users/:userId/friends/:friendId
 * @access Private
 */
const sendFriendRequestController = async (req, res, next) => {
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
  const { userId, friendId: receiverId } = req.params;

  /**
   * Checks if the user id from jwt is the same as one in url param,
   * even though, the user id from the url param is never used.
   * It is only present in the url for stylistic reasons as I'm trying to
   * keep my REST API restfull as possible.
   */
  if (requester.id !== userId) {
    res.status(403);
    return next(new Error('invalid token'));
  }

  // Check if the receiver user exists
  const receiver = await User.findOne({ where: { id: receiverId } });
  if (!receiver) {
    res.status(
      400
    ) /* Not sure what status code should be used (400, 404 or other) */;
    return next(
      new Error("can't send friend request to a user that doesn't exist")
    );
  }

  // Check if friendship between given users already exists
  const areFriendsAlready =
    (await Friend.count({
      where: {
        [Op.or]: [
          {
            [Op.and]: {
              requesterId: requester.id,
              receiverId,
            },
          },
          {
            [Op.and]: {
              requesterId: receiverId,
              receiverId: requester.id,
            },
          },
        ],
      },
    })) === 1;

  if (areFriendsAlready) {
    res.status(409);
    return next(new Error('friendship already exists'));
  }

  // Send friend request
  const friendship = await requester.addReceiver(receiver);

  return res.status(201).json(friendship);
};

/**
 * @desc   Accept or reject friend request
 * @route  PUT /api/users/:userId/friends/:friendId
 * @access Private
 */
const respondToFriendRequestController = async (req, res, next) => {
  // Express-validator boilerplate
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({
      errors: errors.array().map((error) => ({
        message: error.msg,
        param: error.param,
      })),
    });

  const receiver = req.user;
  const { userId, friendId: requesterId } = req.params;
  const { response } = req.body;

  /**
   * Checks if the user id from jwt is the same as one in url param,
   * even though, the user id from the url param is never used.
   * It is only present in the url for stylistic reasons as I'm trying to
   * keep my REST API restfull as possible.
   */
  if (receiver.id !== userId) {
    res.status(403);
    return next(new Error('invalid token'));
  }

  const friendship = await Friend.findOne({
    where: {
      requesterId,
      receiverId: receiver.id,
      status: 'pending',
    },
  });

  if (!friendship) {
    res.status(400);
    return next(new Error('updating friendship status failed'));
  }

  await friendship.update({ status: response });

  return res.status(200).json(friendship);
};

export { sendFriendRequestController, respondToFriendRequestController };
