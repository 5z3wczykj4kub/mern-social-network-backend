import { body, param, query } from 'express-validator';

const getOnePostValidator = [
  param('postId')
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

const addPostValidator = [
  body('content')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('post content must not be empty'),
];

export { getOnePostValidator, addPostValidator };
