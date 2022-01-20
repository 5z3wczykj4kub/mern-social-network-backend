import mongoose from 'mongoose';

const schema = mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 3000,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Comment', schema);
