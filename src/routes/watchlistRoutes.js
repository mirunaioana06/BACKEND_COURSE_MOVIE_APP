import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { watchlistLimiter } from '../middleware/rateMiddleware.js';

import {
  addToWatchlist,
  updateWatchlistItem,
  removeFromWatchlist,
} from '../controllers/watchlistController.js';

import { validateRequest } from '../middleware/validateRequest.js';
import { addToWatchlistSchema } from '../validators/watchlistValidators.js';

const router = express.Router();
router.use(authMiddleware);
router.use(watchlistLimiter);

router.post('/', validateRequest(addToWatchlistSchema), addToWatchlist);

router.put('/:id', updateWatchlistItem);
router.delete('/:id', removeFromWatchlist);

export default router;
