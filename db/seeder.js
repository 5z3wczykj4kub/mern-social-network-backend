import bcrypt from 'bcryptjs';
import 'colors';
import 'dotenv/config';
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
    await User.bulkCreate(users);
    console.log('Database seeding successed'.green);
  } catch (error) {
    console.error('Database seeding failed'.red);
  }
};

const destroyDatabaseMockedData = async () => {
  try {
    await User.destroy({ truncate: true });
    console.log('Database truncating successed'.green);
  } catch (error) {
    console.log('Database truncating failed'.red);
  }
};

if (process.argv[2] === '-d') {
  await destroyDatabaseMockedData();
} else {
  await seedDatabaseWithMockedData();
}
process.exit(1);
