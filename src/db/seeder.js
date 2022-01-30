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
    // Create many users
    const createdUsers = await User.bulkCreate(users, { validate: true });

    // Create friendships:
    // ...first send some random invitations,
    // where every third person requests the friendship,
    // while others are receivers...
    await Promise.all(
      await createdUsers.map(async (createdUser, index, array) => {
        if (index % 3 === 0)
          return await createdUser.addReceiver(array[index + 1]);
        if (index === array.length - 1) return;
        return await createdUser.addRequester(array[index + 1]);
      })
    );
    // ...then get some specifc users...
    const johnDoe = await User.findOne({
      where: { firstName: 'john', lastName: 'doe' },
    });
    const janeDoe = await User.findOne({
      where: { firstName: 'jane', lastName: 'doe' },
    });
    const maxMustermann = await User.findOne({
      where: { firstName: 'max', lastName: 'mustermann' },
    });

    // ...and set ther friendships...
    // await johnDoe.addReceivers([janeDoe, 10 /* Snoop Dogg's id */]);
    // await janeDoe.addReceiver(maxMustermann);

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
    console.log('Database dropping successed'.green);
  } catch (error) {
    console.log(
      `Database dropping failed: ${
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
