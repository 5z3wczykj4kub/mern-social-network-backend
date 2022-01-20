import mongoose from 'mongoose';

const schema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 50,
      lowercase: true,
    },
    lastName: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 50,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      minLength: 3,
      maxLength: 320,
      lowercase: true,
    },
    avatarImageUrl: String,
    domicile: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 85, // Taumatawhakatangihangakoauauotamateaturipukakapikimaungahoronukupokaiwhenuakitanatahu
      lowercase: true,
    },
    gender: {
      type: String,
      required: true,
      lowercase: true,
      enum: ['male', 'female'],
    },
    dateOfBirth: {
      type: Date,
      required: true,
      /**
       * FIXME:
       * Add min, max date validation.
       */
    },
    password: {
      type: String,
      required: true,
      minLength: 60,
      maxLength: 60,
      /**
       * From bcryptjs docs (https://www.npmjs.com/package/bcryptjs):
       * "The maximum input length is 72 bytes
       * (note that UTF8 encoded characters use up to 4 bytes)
       * and the length of generated hashes is 60 characters."
       */
    },
    /**
     * TODO:
     * No entry means that no one has sent a friend request.
     * 0 (default) means that the request is pending.
     * 1 stands for "accepted".
     * -1 stands for "rejected".
     *
     * friends: [
     * {
     *   type: mongoose.Schema.Types.ObjectId,
     *   ref: 'User',
     *   status: {
     *     type: Number,
     *     default: 0,
     *     },
     *   },
     * ],
     */
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('User', schema);
