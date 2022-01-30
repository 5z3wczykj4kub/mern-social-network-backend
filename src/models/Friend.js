import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/sequelize.js';

class Friend extends Model {}

Friend.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'pending',
      allowNull: false,
      validate: {
        isIn: [['pending', 'rejected', 'accepted']],
      },
    },
  },
  {
    sequelize,
    modelName: 'Friend',
  }
);

export default Friend;
