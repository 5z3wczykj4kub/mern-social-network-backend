import { param, body } from 'express-validator';

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

export { sendFriendRequestValidator, respondToFriendRequestValidator };
