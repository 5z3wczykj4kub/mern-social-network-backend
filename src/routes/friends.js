import express from 'express';
import {
  cancelFriendRequestController,
  respondToFriendRequestController,
  sendFriendRequestController,
} from '../controllers/friends.js';
import {
  cancelFriendRequestValidator,
  respondToFriendRequestValidator,
  sendFriendRequestValidator,
} from '../validators/friends.js';

const router = express.Router();

router
  .route('/:userId/friends/:friendId')
  .post(sendFriendRequestValidator, sendFriendRequestController)
  .put(respondToFriendRequestValidator, respondToFriendRequestController)
  .delete(cancelFriendRequestValidator, cancelFriendRequestController);

export default router;
