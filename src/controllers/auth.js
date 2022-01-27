import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * @desc   Sign up
 * @route  POST /api/auth/signup
 * @access Public
 */
const signUpController = async (req, res) => {
  // Express-validator boilerplate
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({
      errors: errors.array().map((error) => ({
        message: error.msg,
        param: error.param,
      })),
    });

  // Extract request body
  const {
    firstName,
    lastName,
    email,
    password,
    domicile,
    gender,
    dateOfBirth,
  } = req.body;

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Build user object
  const user = User.build({
    firstName,
    lastName,
    email,
    domicile,
    gender,
    dateOfBirth,
    password: hashedPassword,
  });

  // Save user to a database
  try {
    await user.save();
    res.status(201).json({
      // Sign and send JWT
      jwt: jwt.sign({ id: user.id }, process.env.JWT_SECRET),
    });
  } catch (error) {
    return res.status(400).json({
      errors: error.errors.map((error) => ({
        message: error.message,
        param: error.path,
      })),
    });
  }
};

/**
 * @desc   Sign in
 * @route  POST /api/auth/signin
 * @access Public
 */
const signInController = async (req, res, next) => {
  // Express-validator boilerplate
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({
      errors: errors.array().map((error) => ({
        message: error.msg,
        param: error.param,
      })),
    });

  // Extract request body
  const { email, password } = req.body;

  const error = new Error('invalid email or password');

  // Validate email
  const user = await User.findOne({
    attributes: ['id', 'password'],
    where: { email },
  });
  if (!user) {
    res.status(401);
    return next(error);
  }

  // Validate password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    res.status(401);
    return next(error);
  }

  // Sign and send JWT
  return res.status(200).json({
    jwt: jwt.sign({ id: user.id }, process.env.JWT_SECRET),
  });
};

/**
 * @desc   Get users profile data
 * @route  GET /api/auth
 * @access Private
 */
const getAuthUserController = async (req, res) => {
  res.status(200).json(req.user);
};

export { signUpController, signInController, getAuthUserController };
