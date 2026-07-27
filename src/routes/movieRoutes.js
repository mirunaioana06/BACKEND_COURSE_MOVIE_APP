import express from 'express';
import { videoUploadLimiter, reviewLimiter } from '../middleware/rateMiddleware.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { reviewSchema } from '../validators/reviewValidators.js';
import { requireMovieOwner } from '../middleware/movieOwnerMiddleware.js';
import { uploadVideo } from '../middleware/videoUpload.js';
import {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
} from '../controllers/movieController.js';
import { createMovieSchema, updateMovieSchema } from '../validators/movieValidators.js';
import { uploadMovieVideo, getMovieVideoUrl } from '../controllers/movieVideoController.js';
import {
  createReview,
  updateReview,
  deleteReview,
  getMovieRating,
} from '../controllers/reviewController.js';

const router = express.Router();

router.post(
  '/:movieId/video',
  authMiddleware,
  videoUploadLimiter,
  requireMovieOwner,
  uploadVideo.single('video'),
  uploadMovieVideo,
);

router.get('/:movieId/video-url', authMiddleware, getMovieVideoUrl);
router.delete('/:movieId', authMiddleware, requireMovieOwner, deleteMovie);
router.get('/:movieId/rating', authMiddleware, getMovieRating);
router.post(
  '/:movieId/review',
  authMiddleware,
  reviewLimiter,
  validateRequest(reviewSchema),
  createReview,
);

router.put(
  '/:movieId/review',
  authMiddleware,
  reviewLimiter,
  validateRequest(reviewSchema),
  updateReview,
);

router.delete('/:movieId/review', authMiddleware, reviewLimiter, deleteReview);
router.get('/', getMovies);

router.get('/:movieId', getMovieById);
router.post('/', authMiddleware, validateRequest(createMovieSchema), createMovie);

router.put(
  '/:movieId',
  authMiddleware,
  requireMovieOwner,
  validateRequest(updateMovieSchema),
  updateMovie,
);

export default router;
