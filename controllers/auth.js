import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const signUpController = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  // Save user to a database
  try {
    var user = new User(req.body);
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    res.status(201).json({
      jwt: jwt.sign({ id: user._id }, process.env.JWT_SECRET),
    });
  } catch (error) {
    /**
     * Create error and pass it to express error handling middleware when:
     * database validation fails,
     * hashing password fails.
     */
    res.status(500);
    return next(new Error('Saving user to a database failed'));
  }
};

export const signInController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;
  const user = await User.findOne({ email });

  // Generate JWT if the given email and password is valid
  if (user && (await bcrypt.compare(password, user.password)))
    return res.status(201).json({
      jwt: jwt.sign({ id: user._id }, process.env.JWT_SECRET),
    });

  return res.status(401).json({ error: 'Incorrect email or password' });
};

export const getAuthUserController = async (req, res) => {
  res.status(200).json({ ...req.authUser.toObject(), timestamp: new Date() });
};
