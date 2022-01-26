import bcrypt from 'bcryptjs';
import 'colors';
import 'dotenv/config';
import sequelize from '../config/sequelize.js';
import User from '../models/User.js';
import { mockedUsers } from './data.js';

const seedDatabaseWithMockedData = async () => {
  try {
    const users = await Promise.all(
      mockedUsers.map(async (mockedUser) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(mockedUser.password, salt);
        return { ...mockedUser, password: hashedPassword };
      })
    );
    sequelize.sync();
    await User.bulkCreate(users, { validate: true });
    console.log('Database seeding successed'.green);
  } catch (error) {
    console.error(
      `Database seeding failed: ${
        error.message ? error.message : 'no error message'
      }`.red
    );
  }
};

const destroyDatabaseMockedData = async () => {
  try {
    await sequelize.drop();
    console.log('Database droping successed'.green);
  } catch (error) {
    console.log(
      `Database droping failed ${
        error.message ? error.message : 'no error message'
      }`.red
    );
  }
};

if (process.argv[2] === '-d') {
  await destroyDatabaseMockedData();
} else {
  await seedDatabaseWithMockedData();
}
process.exit(1);
