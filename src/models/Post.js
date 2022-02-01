import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/sequelize.js';
import User from './User.js';

class Post extends Model {}

Post.init(
  {
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    // Images, videos etc.
    media: {
      type: DataTypes.STRING,
      /**
       * TODO:
       * Validate for being either a
       * pathname or some kind of id.
       */
    },
  },
  {
    sequelize,
    modelName: 'Post',
  }
);

// One-To-Many relationship
User.hasMany(Post, {
  foreignKey: {
    name: 'authorId',
    allowNull: false,
  },
});
Post.belongsTo(User, { foreignKey: 'authorId' });

export default Post;
