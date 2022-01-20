import { body, query } from 'express-validator';

export const getPostsValidator = [
  query('page')
    .exists()
    .withMessage("Query parameter doesn't exist")
    .bail()
    .toInt()
    .isNumeric({ min: 0 })
    .withMessage('Query parameter `page` should be a positive integer'),
  query('limit')
    .exists()
    .withMessage("Query parameter doesn't exist")
    .bail()
    .toInt()
    .isNumeric({ min: 0, max: 100 })
    .withMessage(
      'Query parameter `limit` should be an integer between 0 and 100'
    ),
];

export const addPostValidator = body('text')
  .trim()
  .escape()
  .isLength({ min: 1, max: 3000 })
  .withMessage('Must be between 1 and 3000 characters in length');
