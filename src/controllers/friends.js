import { getUserFriendsQuery } from '../db/queries.js';
import { validationResult } from 'express-validator';
import { Op, QueryTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';
import checkIfFriendsOrOwner from '../helpers/checkIfFriendsOrOwner.js';
import Friend from '../models/Friend.js';
import User from '../models/User.js';

/**
 * @desc   Get friends of a given user
 * @route  GET /api/users/:userId/friends
 * @access Private
 */
const getUserFriendsController = async (req, res, next) => {
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

  // Check if the user we're looking for exists
  const user = await User.findOne({ where: { id: userId } });
  if (!user) {
    res.status(404);
    return next(
      new Error(`user with the given id (${userId}) doesn\'t exists`)
    );
  }

  /**
   * This endpoint allows to get friends of a specific user.
   * If the user is the one requesting it
   * (e.g., end user browsing through his/her friends list),
   * than we can return data right away.
   * If the requesting user wants to get friends of another user,
   * than we have to check if they are friends.
   */
  const isFriendsOrOwner = await checkIfFriendsOrOwner(requester, user);

  if (!isFriendsOrOwner) {
    res.status(403);
    return next(new Error('unauthorized to view requested user friends'));
  }

  const { cursor, limit } = req.query;

  /**
   * Mimic Sequelize `Model.findAndCountAll()` method's return value.
   * https://github.com/sequelize/sequelize/blob/3092462fc02a7754b9962cb2614dd7d3d0c10133/lib/model.js#L2207
   */
  const [[{ count }], rows] = await Promise.all([
    sequelize.query(getUserFriendsQuery(userId, cursor, limit, true), {
      type: QueryTypes.SELECT,
    }),
    sequelize.query(getUserFriendsQuery(userId, cursor, limit), {
      type: QueryTypes.SELECT,
    }),
  ]);

  return res.status(200).json({
    count,
    rows,
  });
};

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

  // Prevent user from sending friend requests to himself/herself
  if (requester.id === receiverId) {
    res.status(400);
    return next(
      new Error('user cannot send a friend request to himself/herself')
    );
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

/**
 * @desc   Cancel friend request
 * @route  DELETE /api/users/:userId/friends/:friendId
 * @access Private
 */
const cancelFriendRequestController = async (req, res, next) => {
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

  const isFriendRequestCanceled =
    (await Friend.destroy({
      where: {
        requesterId: requester.id,
        receiverId,
        status: 'pending',
      },
    })) === 1;

  if (!isFriendRequestCanceled) {
    res.status(400);
    return next(new Error('canceling friend request failed'));
  }

  return res.status(200).json({
    message: 'friend request cancelation success',
  });
};

export {
  getUserFriendsController,
  sendFriendRequestController,
  respondToFriendRequestController,
  cancelFriendRequestController,
};
