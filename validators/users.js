import { query } from 'express-validator';

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
    .isUUID()
    .optional()
    .withMessage('query param `leid` must be valid uuid'),
];

export { getManyUsersValidator };
