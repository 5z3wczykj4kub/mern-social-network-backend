import User from '../models/User.js';
import { validationResult } from 'express-validator';
import { Op } from 'sequelize';
import sequelize from '../config/sequelize.js';

const getManyUsersController = async (req, res, next) => {
  // Express-validator boilerplate
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({
      errors: errors.array().map((error) => ({
        message: error.msg,
        param: error.param,
      })),
    });

  const { search, leid, limit } = req.query;

  /**
   * Find users, where the search phrase
   * is a substring of their full name.
   *
   * For cursor based pagination
   * use `leid` (last entity id),
   * whose value represents the last list item viewed on the front-end.
   *
   * Given this information,
   * with the use of SQL subqueries,
   * we can infer which records to be returned as the next set of data.
   *
   * Cursor based pagination, in opposition to the offset one,
   * prevents from returning duplicated or incomplete data.
   */
  const where = leid
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
              [Op.lt]: leid,
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

export { getManyUsersController };
