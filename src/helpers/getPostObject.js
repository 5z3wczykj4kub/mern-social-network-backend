/**
 * Helper function
 * preparing post object
 * to be sent as JSON payload
 */
const getPostObject = (post, author) => ({
  id: post.id,
  content: post.content,
  media: post.media ? post.media : null,
  comments: post.comments,
  createdAt: post.createdAt,
  author: {
    id: author ? author.id : post.authorId,
    firstName: author ? author.firstName : post.firstName,
    lastName: author ? author.lastName : post.lastName,
    avatar: author ? author.avatar : post.avatar,
  },
});

export default getPostObject;
