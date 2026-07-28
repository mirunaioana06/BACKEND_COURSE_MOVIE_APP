import { Queue } from 'bullmq';

const taskQueue = new Queue('task-queue', {
  connection: {
    host: '127.0.0.1',
    port: 6379,
  },
});

const addJob = async (data) => {
  const job = await taskQueue.add('my-job', data, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
  });
  return job;
};

const addVideoDeletionJob = async (videoKey) => {
  const job = await taskQueue.add(
    'delete-s3-video',
    {
      videoKey,
    },
    {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
    },
  );

  return job;
};

export { taskQueue, addJob, addVideoDeletionJob };
