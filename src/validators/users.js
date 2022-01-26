import { query, param } from 'express-validator';

const getOneUserValidator = param('userId')
  .trim()
  .escape()
  .isInt()
  .withMessage('invalid id format');

const getManyUsersValidator = [
  query('limit')
    .trim()
    .escape()
    .toLowerCase()
    .default(10)
    .toInt()
    .isInt({ min: 1, max: 100 })
    .withMessage(
      'query param `limit` must be an integer between 1 and 100 (defaults to 10)'
    ),
  query('search')
    .trim()
    .escape()
    .toLowerCase()
    .custom((searchPhrase) => {
      const searchPhraseWords = searchPhrase.split(' ');
      if (searchPhraseWords.length > 2)
        throw new Error(
          'query param `search` must contain of max two alphabetic words'
        );
      return true;
    })
    .customSanitizer((searchPhrase) => searchPhrase.split(' ').join('')),
  query('leid')
    .trim()
    .escape()
    .isInt()
    .optional()
    .withMessage('query param `leid` must have valid id format'),
];

export { getOneUserValidator, getManyUsersValidator };
