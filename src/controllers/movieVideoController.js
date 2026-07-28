import { prisma } from '../config/db.js';

import { createVideoViewUrl, deleteVideoObject } from '../services/s3Service.js';
import { addVideoDeletionJob } from '../queues/taskQueue.js';

const uploadMovieVideo = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      status: 'fail',
      message: 'A video file is required',
    });
  }

  const newVideoKey = req.file.key;
  const oldVideoKey = req.movie.videoKey;

  try {
    const updatedMovie = await prisma.movie.update({
      where: {
        id: req.movie.id,
      },
      data: {
        videoKey: newVideoKey,
      },
      select: {
        id: true,
        title: true,
        videoKey: true,
      },
    });

    if (oldVideoKey) {
      try {
        const cleanupJob = await addVideoDeletionJob(oldVideoKey);

        console.log('[QUEUE] Video cleanup job added:', {
          jobId: cleanupJob.id,
          movieId: req.movie.id,
          videoKey: oldVideoKey,
        });
      } catch (queueError) {
        console.error('Failed to queue the old movie video deletion:', {
          movieId: req.movie.id,
          videoKey: oldVideoKey,
          message: queueError.message,
        });
      }
    }

    return res.status(200).json({
      status: 'success',
      message: 'Movie video uploaded successfully',
      data: {
        movie: updatedMovie,
      },
    });
  } catch (error) {
    try {
      await deleteVideoObject(newVideoKey);
    } catch (cleanupError) {
      console.error('Failed to clean up the new S3 video:', {
        movieId: req.movie.id,
        videoKey: newVideoKey,
        message: cleanupError.message,
      });
    }

    next(error);
  }
};

const getMovieVideoUrl = async (req, res) => {
  const { movieId } = req.params;

  const movie = await prisma.movie.findUnique({
    where: {
      id: movieId,
    },
    select: {
      id: true,
      title: true,
      videoKey: true,
    },
  });

  if (!movie) {
    return res.status(404).json({
      status: 'fail',
      message: 'Movie not found',
    });
  }

  if (!movie.videoKey) {
    return res.status(404).json({
      status: 'fail',
      message: 'This movie does not have a video',
    });
  }

  const expiresIn = 15 * 60;

  const videoUrl = await createVideoViewUrl(movie.videoKey, expiresIn);

  return res.status(200).json({
    status: 'success',
    data: {
      movieId: movie.id,
      title: movie.title,
      videoUrl,
      expiresIn,
    },
  });
};

export { uploadMovieVideo, getMovieVideoUrl };
