import { body, param, query } from 'express-validator';

const getUserFriendsValidator = [
  param('userId')
    .trim()
    .escape()
    .toInt()
    .isInt()
    .withMessage('invalid id format'),
  query('limit')
    .trim()
    .escape()
    .default(10)
    .toInt()
    .isInt({ min: 1, max: 100 })
    .withMessage(
      'query param `limit` must be an integer between 1 and 100 (defaults to 10)'
    ),
  query('cursor')
    .trim()
    .escape()
    .isInt()
    .optional()
    .withMessage('cursor invalid'),
];

const sendFriendRequestValidator = [
  param('userId')
    .trim()
    .escape()
    .toInt()
    .isInt()
    .withMessage('invalid id format'),
  param('friendId')
    .trim()
    .escape()
    .toInt()
    .isInt()
    .withMessage('invalid id format'),
];

const respondToFriendRequestValidator = [
  param('userId')
    .trim()
    .escape()
    .toInt()
    .isInt()
    .withMessage('invalid id format'),
  param('friendId')
    .trim()
    .escape()
    .toInt()
    .isInt()
    .withMessage('invalid id format'),
  body('response')
    .trim()
    .toLowerCase()
    .isIn(['rejected', 'accepted'])
    .withMessage('response should be either `rejected` or `accepted`'),
];

const cancelFriendRequestValidator = [
  param('userId')
    .trim()
    .escape()
    .toInt()
    .isInt()
    .withMessage('invalid id format'),
  param('friendId')
    .trim()
    .escape()
    .toInt()
    .isInt()
    .withMessage('invalid id format'),
];

export {
  getUserFriendsValidator,
  sendFriendRequestValidator,
  respondToFriendRequestValidator,
  cancelFriendRequestValidator,
};
