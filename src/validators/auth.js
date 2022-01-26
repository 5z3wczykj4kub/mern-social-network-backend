import { body } from 'express-validator';
import User from '../models/User.js';

const signUpValidator = [
  body('firstName').trim().escape().toLowerCase(),
  body('lastName').trim().escape().toLowerCase(),
  body('email')
    .normalizeEmail()
    .custom(async (email) => {
      const isEmailAlreadyUsed = !!(await User.count({ where: { email } }));
      if (isEmailAlreadyUsed) throw new Error('email already used');
      return true;
    }),
  body('password')
    .trim()
    .matches(/^([a-zA-Z~`!@#$%^&*()_\-+={[}\]:;"'\|\\<,>.?\/\d]){12,72}$/)
    .withMessage(
      'password must be between 12 and 72 characters in length and not contain any whitespaces'
    ),
  body('confirmedPassword')
    .trim()
    .custom((confirmedPassword, { req }) => {
      if (confirmedPassword !== req.body.password)
        throw new Error('passwords do not match');
      return true;
    }),
  body('domicile').trim().escape().toLowerCase(),
  body('gender').trim().escape().toLowerCase(),
  body('dateOfBirth').trim().escape().toLowerCase(),
];

const signInValidator = [
  body('email').normalizeEmail().isEmail().withMessage('invalid email format'),
  body('password')
    .matches(/^([a-zA-Z~`!@#$%^&*()_\-+={[}\]:;"'\|\\<,>.?\/\d]){12,72}$/)
    .withMessage(
      'password must be between 12 and 72 characters in length and not contain any whitespaces'
    ),
];

export { signUpValidator, signInValidator };
