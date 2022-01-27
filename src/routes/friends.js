import express from 'express';
import {
  respondToFriendRequestController,
  sendFriendRequestController,
} from '../controllers/friends.js';
import {
  respondToFriendRequestValidator,
  sendFriendRequestValidator,
} from '../validators/friends.js';

const router = express.Router();

router
  .route('/:userId/friends/:friendId')
  .post(sendFriendRequestValidator, sendFriendRequestController)
  .put(respondToFriendRequestValidator, respondToFriendRequestController);

export default router;
