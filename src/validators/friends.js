import { param } from 'express-validator';

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

export { sendFriendRequestValidator };
