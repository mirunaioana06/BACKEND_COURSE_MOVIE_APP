import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { getMyReviews } from '../controllers/reviewController.js';

const router = express.Router();

router.get('/me', authMiddleware, getMyReviews);

export default router;
