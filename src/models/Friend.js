import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/sequelize.js';

class Friend extends Model {}

Friend.init(
  {
    status: {
      type: DataTypes.STRING,
      defaultValue: 'pending',
    },
  },
  {
    sequelize,
    modelName: 'Friend',
  }
);

export default Friend;
