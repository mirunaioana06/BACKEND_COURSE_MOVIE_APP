import cron from 'node-cron';
import { prisma } from '../config/db.js';

const startDatabaseStatsJob = () => {
  cron.schedule(
    '0 9 * * *',
    async () => {
      try {
        const [usersCount, moviesCount, reviewsCount] = await Promise.all([
          prisma.user.count(),
          prisma.movie.count(),
          prisma.review.count(),
        ]);

        console.log('[CRON] Database statistics:', {
          users: usersCount,
          movies: moviesCount,
          reviews: reviewsCount,
        });
      } catch (error) {
        console.error('[CRON] Failed to read database statistics:', error.message);
      }
    },
    {
      name: 'database-statistics',
      timezone: 'Europe/Bucharest',
      noOverlap: true,
    },
  );
};

export { startDatabaseStatsJob };
