import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE_NAME,
  process.env.MYSQL_USERNAME,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_URI,
    dialect: 'mysql',
  }
);

export default sequelize;
