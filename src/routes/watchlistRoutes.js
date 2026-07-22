import express from 'express';

import {
  addToWatchlist,
  updateWatchlistItem,
  removeFromWatchlist,
} from '../controllers/watchlistController.js';

const router = express.Router();

router.post('/', addToWatchlist);
router.put('/:id', updateWatchlistItem);
router.delete('/:id', removeFromWatchlist);

export default router;
