import { body } from 'express-validator';
import User from '../models/User.js';

export const signUpValidator = [
  body('firstName')
    .trim()
    .toLowerCase()
    .escape()
    .isLength({ min: 1, max: 50 })
    .withMessage('Must be between 1 and 50 characters in length'),
  body('lastName')
    .trim()
    .toLowerCase()
    .escape()
    .isLength({ min: 1, max: 50 })
    .withMessage('Must be between 1 and 50 characters in length'),
  body('email')
    .isEmail()
    .withMessage('Incorrect email format')
    .bail()
    .normalizeEmail()
    .custom(async (email) => {
      // Check if email is already used
      const user = await User.findOne({ email });
      if (user) throw new Error('Email is already used');
      return true;
    }),
  body('password')
    .isLength({ min: 12, max: 72 })
    .withMessage('Must be between 12 and 72 characters in length')
    .bail()
    .matches(/^([a-zA-Z~`!@#$%^&*()_\-+={[}\]:;"'\|\\<,>.?\/\d]){12,72}$/)
    .withMessage('Must not contain any whitespaces'),
  body('confirmedPassword').custom((confirmedPassword, { req }) => {
    if (confirmedPassword !== req.body.password)
      throw new Error('Passwords do not match');
    return true;
  }),
  body('domicile')
    .trim()
    .toLowerCase()
    .escape()
    .isLength({ min: 1, max: 85 })
    .withMessage('Must be between 1 and 85 characters in length'),
  body('gender')
    .trim()
    .toLowerCase()
    .custom((gender) => {
      if (gender === 'male' || gender === 'female') return true;
      throw new Error('Gender must be either male or female');
    }),
  body('dateOfBirth')
    .trim()
    .escape()
    .notEmpty()
    /**
     * FIXME:
     * Add better date validation.
     */
    .withMessage('Invalid date format'),
];

export const signInValidator = [
  body('email')
    .isEmail()
    .withMessage('Incorrect email format')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 12, max: 72 })
    .withMessage('Must be between 12 and 72 characters in length')
    .bail()
    .matches(/^([a-zA-Z~`!@#$%^&*()_\-+={[}\]:;"'\|\\<,>.?\/\d]){12,72}$/)
    .withMessage('Must not contain any whitespaces'),
];
