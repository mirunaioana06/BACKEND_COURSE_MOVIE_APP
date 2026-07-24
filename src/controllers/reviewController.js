import { prisma } from '../config/db.js';

const createReview = async (req, res) => {
  const { movieId } = req.params;
  const { rating } = req.body;

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

  const watchlistItem = await prisma.watchlistItem.findUnique({
    where: {
      userId_movieId: {
        userId: req.user.id,
        movieId: movieId,
      },
    },
  });

  if (!watchlistItem || watchlistItem.status !== 'COMPLETED') {
    return res.status(403).json({
      error: 'You can only review movies you have completed',
    });
  }

  const existingReview = await prisma.review.findUnique({
    where: {
      userId_movieId: {
        userId: req.user.id,
        movieId: movieId,
      },
    },
  });

  if (existingReview) {
    return res.status(400).json({
      error: 'You have already reviewed this movie',
    });
  }

  const review = await prisma.review.create({
    data: {
      rating: rating,
      userId: req.user.id,
      movieId: movieId,
    },
    select: {
      id: true,
      rating: true,
      createdAt: true,
    },
  });

  return res.status(201).json({
    status: 'success',
    data: {
      review: review,
    },
  });
};

const updateReview = async (req, res) => {
  const { movieId } = req.params;
  const { rating } = req.body;

  const existingReview = await prisma.review.findUnique({
    where: {
      userId_movieId: {
        userId: req.user.id,
        movieId: movieId,
      },
    },
  });

  if (!existingReview) {
    return res.status(404).json({
      error: 'Review not found',
    });
  }

  const watchlistItem = await prisma.watchlistItem.findUnique({
    where: {
      userId_movieId: {
        userId: req.user.id,
        movieId: movieId,
      },
    },
  });

  if (!watchlistItem || watchlistItem.status !== 'COMPLETED') {
    return res.status(403).json({
      error: 'You can only review movies you have completed',
    });
  }

  const updatedReview = await prisma.review.update({
    where: {
      userId_movieId: {
        userId: req.user.id,
        movieId: movieId,
      },
    },
    data: {
      rating: rating,
    },
    select: {
      id: true,
      rating: true,
      updatedAt: true,
    },
  });

  return res.status(200).json({
    status: 'success',
    data: {
      review: updatedReview,
    },
  });
};

const deleteReview = async (req, res) => {
  const { movieId } = req.params;

  const existingReview = await prisma.review.findUnique({
    where: {
      userId_movieId: {
        userId: req.user.id,
        movieId: movieId,
      },
    },
  });

  if (!existingReview) {
    return res.status(404).json({
      error: 'Review not found',
    });
  }

  await prisma.review.delete({
    where: {
      userId_movieId: {
        userId: req.user.id,
        movieId: movieId,
      },
    },
  });

  return res.status(200).json({
    status: 'success',
    message: 'Review deleted successfully',
  });
};

const getMovieRating = async (req, res) => {
  const { movieId } = req.params;

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

  const ratingStats = await prisma.review.aggregate({
    where: {
      movieId: movieId,
    },
    _avg: {
      rating: true,
    },
    _count: {
      rating: true,
    },
  });

  const averageRating =
    ratingStats._avg.rating === null ? null : Number(ratingStats._avg.rating.toFixed(2));

  return res.status(200).json({
    status: 'success',
    data: {
      averageRating: averageRating,
      ratingsCount: ratingStats._count.rating,
    },
  });
};

const getMyReviews = async (req, res) => {
  const reviews = await prisma.review.findMany({
    where: {
      userId: req.user.id,
    },
    select: {
      rating: true,
      createdAt: true,
      updatedAt: true,
      movie: {
        select: {
          id: true,
          title: true,
          posterUrl: true,
        },
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });

  return res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews: reviews,
    },
  });
};

export { createReview, updateReview, deleteReview, getMovieRating, getMyReviews };
