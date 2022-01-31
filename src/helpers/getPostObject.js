/**
 * Helper function
 * preparing post object
 * to be sent as JSON payload
 */
const getPostObject = (post, author) => ({
  id: post.id,
  content: post.content,
  media: post.media ? post.media : null,
  createdAt: post.createdAt,
  author: {
    id: author.id,
    firstName: author.firstName,
    lastName: author.lastName,
    avatar: author.avatar,
  },
});

export default getPostObject;
