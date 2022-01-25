import express from 'express';
import { getManyUsersController } from '../controllers/users.js';
import { getManyUsersValidator } from '../validators/users.js';

const router = express.Router();

router.route('/').get(getManyUsersValidator, getManyUsersController);

export default router;
