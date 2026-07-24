import 'dotenv/config';
import passport from './config/passport.js';
import express from 'express';

import movieRoutes from './routes/movieRoutes.js';
import { connectDB, disconnectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import watchlistRoutes from './routes/watchlistRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

import reviewRoutes from './routes/reviewRoutes.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

await connectDB();

app.use('/movies', movieRoutes);
app.use('/auth', authRoutes);
app.use('/watchlist', watchlistRoutes);
app.use('/reviews', reviewRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = 5001;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection: ', err);
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});

process.on('uncaughtException', async (err) => {
  console.error('Uncaught Exception: ', err);
  await disconnectDB();
  process.exit(1);
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
});
