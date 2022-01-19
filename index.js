import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import routes from './routes/routes.js';

const app = express();

app.use(express.json());

app.use('/api', routes);

// prettier-ignore
app.use((err, req, res, next) => {
  res.json({
    error: err.message
  });
});

// Connect to a database and start the server
(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  } catch (error) {
    console.error(error.message);
  }
})();
