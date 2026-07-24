import { prisma } from '../config/db.js';

const addToWatchlist = async (req, res) => {
  const { movieId, status, notes } = req.body;

  const movie = await prisma.movie.findUnique({
    where: {
      id: movieId,
    },
  });

  if (!movie) {
    return res.status(404).json({
      error: 'Movie not found',
    });
  }

  const existingInWatchlist = await prisma.watchlistItem.findUnique({
    where: {
      userId_movieId: {
        userId: req.user.id,
        movieId: movieId,
      },
    },
  });

  if (existingInWatchlist) {
    return res.status(400).json({
      error: 'Movie already in the watchlist',
    });
  }

  const watchlistItem = await prisma.watchlistItem.create({
    data: {
      userId: req.user.id,
      movieId: movieId,
      status: status || 'PLANNED',
      notes: notes,
    },
  });

  res.status(201).json({
    status: 'success',
    data: {
      watchlistItem: watchlistItem,
    },
  });
};

const updateWatchlistItem = async (req, res) => {
  const { status, notes } = req.body;

  const watchlistItem = await prisma.watchlistItem.findUnique({
    where: {
      id: req.params.id,
    },
  });

  if (!watchlistItem) {
    return res.status(404).json({
      error: 'Watchlist item not found',
    });
  }

  if (watchlistItem.userId !== req.user.id) {
    return res.status(403).json({
      error: 'Not allowed to update this watchlist item',
    });
  }

  const updateData = {};

  if (status !== undefined) {
    updateData.status = status.toUpperCase();
  }

  if (notes !== undefined) {
    updateData.notes = notes;
  }

  const updatedItem = await prisma.watchlistItem.update({
    where: {
      id: req.params.id,
    },
    data: updateData,
  });

  res.status(200).json({
    status: 'success',
    data: {
      watchlistItem: updatedItem,
    },
  });
};

const removeFromWatchlist = async (req, res) => {
  const watchlistItem = await prisma.watchlistItem.findUnique({
    where: {
      id: req.params.id,
    },
  });
  if (!watchlistItem) {
    return res.status(404).json({
      error: 'Watchlist item  not found',
    });
  }
  if (watchlistItem.userId !== req.user.id) {
    return res.status(403).json({
      error: 'Not allowed to remove this watchlist item',
    });
  }
  await prisma.watchlistItem.delete({
    where: {
      id: req.params.id,
    },
  });
  res.status(200).json({
    status: 'success',
    message: 'Movie removed from watchlist',
  });
};

export { addToWatchlist, updateWatchlistItem, removeFromWatchlist };
