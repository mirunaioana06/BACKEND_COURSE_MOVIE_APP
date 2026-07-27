import { prisma } from '../config/db.js';
import { deleteVideoObject } from '../services/s3Service.js';

const createMovie = async (req, res, next) => {
  try {
    const movie = await prisma.movie.create({
      data: {
        ...req.body,
        createdBy: req.user.id,
      },
    });

    return res.status(201).json({
      status: 'success',
      data: {
        movie,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getMovies = async (req, res, next) => {
  try {
    const movies = await prisma.movie.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.status(200).json({
      status: 'success',
      results: movies.length,
      data: {
        movies,
      },
    });
  } catch (error) {
    next(error);
  }
};
const getMovieById = async (req, res, next) => {
  try {
    const movie = await prisma.movie.findUnique({
      where: {
        id: req.params.movieId,
      },
    });

    if (!movie) {
      return res.status(404).json({
        status: 'fail',
        message: 'Movie not found',
      });
    }

    return res.status(200).json({
      status: 'success',
      data: {
        movie,
      },
    });
  } catch (error) {
    next(error);
  }
};
const updateMovie = async (req, res, next) => {
  try {
    const movie = await prisma.movie.update({
      where: {
        id: req.movie.id,
      },
      data: req.body,
    });

    return res.status(200).json({
      status: 'success',
      data: {
        movie,
      },
    });
  } catch (error) {
    next(error);
  }
};
const deleteMovie = async (req, res, next) => {
  try {
    const { id, videoKey } = req.movie;

    await deleteVideoObject(videoKey);

    await prisma.movie.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      status: 'success',
      message: 'Movie and associated video deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export { getMovies, getMovieById, createMovie, updateMovie, deleteMovie };
