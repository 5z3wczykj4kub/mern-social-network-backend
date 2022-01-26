import express from 'express';
import {
  getManyUsersController,
  getOneUserController,
} from '../controllers/users.js';
import {
  getManyUsersValidator,
  getOneUserValidator,
} from '../validators/users.js';

const router = express.Router();

router.route('/').get(getManyUsersValidator, getManyUsersController);
router.route('/:userId').get(getOneUserValidator, getOneUserController);

export default router;
