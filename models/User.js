import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/sequelize.js';

class User extends Model {}

User.init(
  {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [1, 50],
          msg: 'first name must be between 1 and 50 characters in length',
        },
        isAlpha: {
          args: true,
          msg: 'first name must contain only letters',
        },
        isLowercase: {
          args: true,
          msg: 'first name must be lowercase',
        },
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [1, 50],
          msg: 'last name must be between 1 and 50 characters in length',
        },
        isAlpha: {
          args: true,
          msg: 'last name must contain only letters',
        },
        isLowercase: {
          args: true,
          msg: 'last name must be lowercase',
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          args: true,
          msg: 'invalid email format',
        },
      },
    },
    avatar: {
      type: DataTypes.STRING,
      /**
       * TODO:
       * Validate for being either a
       * pathname or some kind of id.
       */
    },
    domicile: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [1, 85], // Taumatawhakatangihangakoauauotamateaturipukakapikimaungahoronukupokaiwhenuakitanatahu
          msg: 'domicile must be between 1 and 85 characters in length',
        },
        isLowercase: {
          args: true,
          msg: 'domicile must be lowercase',
        },
      },
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: {
          args: [['male', 'female']],
          msg: 'gender must be either male or female',
        },
      },
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: {
          args: true,
          msg: 'invalid date format',
        },
        isAfter: {
          args: '1900-01-01',
          msg: 'the earliest possible date is 1900-01-01',
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: {
          // bcryptjs hash is 60 characters long
          args: 60,
          msg: 'password must be 60 characters long',
        },
      },
    },
  },
  {
    sequelize,
    modelName: 'User',
  }
);

export default User;
