import 'colors';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import sequelize from './config/sequelize.js';
import errorMiddleware from './middleware/error.js';
import routes from './routes/routes.js';

const app = express();

app.use(cors());

app.use(express.json());

app.use('/api', routes);

app.use(errorMiddleware);

// Synchronize database and start the server
await sequelize.sync();
app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`.blue)
);
