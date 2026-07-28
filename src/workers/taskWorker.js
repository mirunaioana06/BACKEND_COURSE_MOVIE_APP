import { Worker } from 'bullmq';
import { deleteVideoObject } from '../services/s3Service.js';
const taskWorker = new Worker(
  'task-queue',
  async (job) => {
    console.log('[WORKER] Processing job:', {
      id: job.id,
      name: job.name,
      data: job.data,
    });

    console.log(`[WORKER] Attempt ${job.attemptsMade + 1} of ${job.opts.attempts}`);
    if (job.name === 'delete-s3-video') {
      const { videoKey } = job.data;

      if (!videoKey) {
        throw new Error('videoKey is required');
      }

      await deleteVideoObject(videoKey);

      console.log('[WORKER] S3 video deleted:', videoKey);

      return {
        deleted: true,
        videoKey,
      };
    }
    await new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });

    console.log('[WORKER] Job completed:', job.id);

    return {
      processed: true,
    };
  },
  {
    connection: {
      host: '127.0.0.1',
      port: 6379,
    },
  },
);
taskWorker.on('failed', (job, error) => {
  console.error(
    `[WORKER] Job ${job?.id} failed after attempt ${job?.attemptsMade}:`,
    error.message,
  );
});

taskWorker.on('error', (error) => {
  console.error('[WORKER] Error:', error.message);
});
