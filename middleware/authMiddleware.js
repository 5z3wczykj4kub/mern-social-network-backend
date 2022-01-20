import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const authMiddleware = async (req, res, next) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith('Bearer')
  )
    return next(
      new Error(
        'Invalid token - user unauthorized to access this protected route'
      )
    );

  try {
    const token = req.headers.authorization.split(' ')[1];
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const authUser = await User.findById(id).select('-password -__v');
    if (!authUser) throw new Error();
    req.authUser = authUser;
    next();
  } catch (error) {
    res.status(401);
    return next(
      new Error(
        'Invalid token - user unauthorized to access this protected route'
      )
    );
  }
};

export default authMiddleware;
