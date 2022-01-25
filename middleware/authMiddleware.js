import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const authMiddleware = async (req, res, next) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith('Bearer')
  ) {
    res.status(401);
    return next(new Error('invalid token'));
  }

  const token = req.headers.authorization.split(' ')[1];

  try {
    var id = jwt.verify(token, process.env.JWT_SECRET).id;
  } catch (error) {
    res.status(401);
    return next(new Error('invalid token'));
  }

  const user = await User.findOne({
    where: { id },
    attributes: { exclude: ['password'] },
    raw: true,
  });
  if (!user) {
    res.status(404);
    return next(new Error("user doesn't exists"));
  }
  req.user = user;
  return next();
};

export default authMiddleware;
