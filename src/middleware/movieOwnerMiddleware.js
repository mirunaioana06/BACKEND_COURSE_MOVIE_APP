import { prisma } from '../config/db.js';

const requireMovieOwner = async (req, res, next) => {
  const { movieId } = req.params;

  const movie = await prisma.movie.findUnique({
    where: {
      id: movieId,
    },
    select: {
      id: true,
      createdBy: true,
      videoKey: true,
    },
  });

  if (!movie) {
    return res.status(404).json({
      status: 'fail',
      message: 'Movie not found',
    });
  }

  if (movie.createdBy !== req.user.id) {
    return res.status(403).json({
      status: 'fail',
      message: 'You are not allowed to manage this movie video',
    });
  }

  req.movie = movie;
  next();
};

export { requireMovieOwner };
