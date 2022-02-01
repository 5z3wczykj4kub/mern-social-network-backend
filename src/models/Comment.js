import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/sequelize.js';
import Post from './Post.js';
import User from './User.js';

class Comment extends Model {}

Comment.init(
  {
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Comment',
  }
);

// One-To-Many relationship
Post.hasMany(Comment, {
  foreignKey: {
    name: 'postId',
    allowNull: false,
  },
});
Comment.belongsTo(Post, { foreignKey: 'postId' });

User.hasMany(Comment, {
  foreignKey: {
    name: 'authorId',
    allowNull: false,
  },
});
Comment.belongsTo(User, { foreignKey: 'authorId' });

export default Comment;
