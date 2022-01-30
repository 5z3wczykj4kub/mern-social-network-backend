import express from 'express';
import {
  cancelFriendRequestController,
  getUserFriendsController,
  respondToFriendRequestController,
  sendFriendRequestController,
} from '../controllers/friends.js';
import {
  cancelFriendRequestValidator,
  getUserFriendsValidator,
  respondToFriendRequestValidator,
  sendFriendRequestValidator,
} from '../validators/friends.js';

const router = express.Router();

router
  .get('/:userId/friends', getUserFriendsValidator, getUserFriendsController)
  .route('/:userId/friends/:friendId')
  .post(sendFriendRequestValidator, sendFriendRequestController)
  .put(respondToFriendRequestValidator, respondToFriendRequestController)
  .delete(cancelFriendRequestValidator, cancelFriendRequestController);

export default router;
