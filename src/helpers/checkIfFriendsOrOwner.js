const checkIfFriendsOrOwner = (requester, user) => {
  if (requester.id !== user.id) return true;

  const [isReceiver, isRequester] = await Promise.all([
    await requester.hasReceiver(user, {
      through: {
        where: { status: 'accepted' },
      },
    }),
    await requester.hasRequester(user, {
      through: {
        where: { status: 'accepted' },
      },
    }),
  ]);

  if (isReceiver || isRequester) return true;

  return false;
};

export default checkIfFriendsOrOwner;
