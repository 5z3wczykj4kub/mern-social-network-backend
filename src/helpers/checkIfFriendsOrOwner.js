import User from '../models/User.js';
/**
 * Not sure if it makes sense
 * to import this module only for JSDoc use
 * (and I'm not even using it, what the hell!?).
 * Guess I should start using TypeScript.
 */

/**
 * Checks to see if the requester is authorized
 * to access a protected resource
 * by checking his or her ownership
 * as well as friendship bounds.
 * @param {User} requester
 * @param {User} user
 * @returns {Promise<Boolean>} Will resolve to either true or false
 */
const checkIfFriendsOrOwner = async (requester, user) => {
  if (requester.id === user.id) return true;

  const [isReceiver, isRequester] = await Promise.all([
    requester.hasReceiver(user, {
      through: {
        where: { status: 'accepted' },
      },
    }),
    requester.hasRequester(user, {
      through: {
        where: { status: 'accepted' },
      },
    }),
  ]);

  if (isReceiver || isRequester) return true;

  return false;
};

export default checkIfFriendsOrOwner;
