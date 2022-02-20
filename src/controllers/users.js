import { validationResult } from 'express-validator';
import { Op } from 'sequelize';
import sequelize from '../config/sequelize.js';
import User from '../models/User.js';
import Friend from '../models/Friend.js';

/**
 * @desc   Get one user
 * @route  GET /api/users/:userId
 * @access Private
 */
const getOneUserController = async (req, res, next) => {
  // Express-validator boilerplate
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({
      errors: errors.array().map((error) => ({
        message: error.msg,
        param: error.param,
      })),
    });

  const requester = req.user;
  const { userId: id } = req.params;

  const user = await User.findOne({
    attributes: { exclude: 'password' },
    where: { id },
  });

  if (!user) {
    res.status(404);
    return next(new Error(`user with the given id (${id}) doesn\'t exist`));
  }

  // Get friendship status and friends count
  const [friendship, friends] = await Promise.all([
    Friend.findOne({
      attributes: ['status'],
      where: {
        [Op.or]: [
          {
            requesterId: requester.id,
            receiverId: user.id,
          },
          {
            requesterId: user.id,
            receiverId: requester.id,
          },
        ],
      },
    }),
    Friend.count({
      where: {
        [Op.and]: [
          {
            [Op.or]: {
              requesterId: user.id,
              receiverId: user.id,
            },
          },
          { status: 'accepted' },
        ],
      },
    }),
  ]);

  return res.status(200).json({
    ...user.toJSON(),
    friendship,
    friends,
  });
};

/**
 * @desc   Get many users
 * @route  GET /api/users
 * @access Private
 */
const getManyUsersController = async (req, res) => {
  // Express-validator boilerplate
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({
      errors: errors.array().map((error) => ({
        message: error.msg,
        param: error.param,
      })),
    });

  const { search, cursor, limit } = req.query;

  /**
   * Find users, where the search phrase
   * is a substring of their full name.
   *
   * Use `cursor` for pagination,
   * which holds the value (id)
   * of the last list item
   * rendered on the front-end.
   *
   * Given this information,
   * with the use of SQL subqueries,
   * we can infer which records to be returned as the next set of data.
   *
   * Cursor based pagination, in opposition to the offset one,
   * prevents from returning duplicated or incomplete data.
   */
  const where = cursor
    ? {
        [Op.and]: [
          sequelize.where(
            sequelize.fn(
              'concat',
              sequelize.col('firstName'),
              sequelize.col('lastName')
            ),
            { [Op.substring]: search }
          ),
          {
            id: {
              [Op.lt]: cursor,
            },
          },
        ],
      }
    : sequelize.where(
        sequelize.fn(
          'concat',
          sequelize.col('firstName'),
          sequelize.col('lastName')
        ),
        { [Op.substring]: search }
      );

  const users = await User.findAndCountAll({
    attributes: {
      exclude: 'password',
    },
    where,
    order: [['id', 'DESC']],
    raw: true,
    limit,
  });

  return res.status(200).json(users);
};

export { getOneUserController, getManyUsersController };
