import 'dotenv/config';
import User from '../models/User.js';
import { MOCKED_USERS_DATA } from './data.js';
import 'colors';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import Post from '../models/Post.js';

const addMockedData = async () => {
  try {
    let mockedUsers = await Promise.all(
      MOCKED_USERS_DATA.map(async (mockedUser) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(mockedUser.password, salt);
        return { ...mockedUser, password: hashedPassword };
      })
    );

    mockedUsers = await User.insertMany(mockedUsers);

    const mockedPosts = mockedUsers.map(({ _id, firstName, lastName }) => ({
      author: _id,
      text: `This is post written by ${firstName} ${lastName}`,
    }));

    await Post.insertMany(mockedPosts);

    console.log('Database seeding success'.green);
  } catch (error) {
    console.log('Database seeding failed'.red);
  }
};

const deleteMockedData = async () => {
  try {
    await User.deleteMany({});
    await Post.deleteMany({});
    console.log('Database cleaning success'.green);
  } catch (error) {
    console.log('Database cleaning failed'.red);
  }
};

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  if (process.argv[2] === '-d') {
    await deleteMockedData();
  } else {
    await addMockedData();
  }
  process.exit(1);
})();
