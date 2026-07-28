import { addJob, taskQueue } from '../queues/taskQueue.js';

try {
  const job = await addJob({
    userId: 123,
  });

  console.log('[QUEUE] Job added successfully:', {
    id: job.id,
    name: job.name,
    data: job.data,
  });
} catch (error) {
  console.error('[QUEUE] Failed to add job:', error.message);
} finally {
  await taskQueue.close();
}
