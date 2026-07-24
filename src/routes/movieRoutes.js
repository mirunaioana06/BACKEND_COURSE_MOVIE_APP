import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { reviewSchema } from '../validators/reviewValidators.js';

import {
  createReview,
  updateReview,
  deleteReview,
  getMovieRating,
} from '../controllers/reviewController.js';

const router = express.Router();

router.get('/:movieId/rating', authMiddleware, getMovieRating);

router.post('/:movieId/review', authMiddleware, validateRequest(reviewSchema), createReview);

router.put('/:movieId/review', authMiddleware, validateRequest(reviewSchema), updateReview);

router.delete('/:movieId/review', authMiddleware, deleteReview);

router.get('/', (req, res) => {
  res.json({ httpMethod: 'get' });
});

router.post('/', (req, res) => {
  res.json({ httpMethod: 'post' });
});

router.put('/', (req, res) => {
  res.json({ httpMethod: 'put' });
});
router.delete('/', (req, res) => {
  res.json({ httpMethod: 'delete' });
});

export default router;
