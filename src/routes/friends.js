import express from 'express';
import { sendFriendRequestController } from '../controllers/friends.js';
import { sendFriendRequestValidator } from '../validators/friends.js';

const router = express.Router();

router
  .route('/:userId/friends/:friendId')
  .post(sendFriendRequestValidator, sendFriendRequestController);

export default router;
