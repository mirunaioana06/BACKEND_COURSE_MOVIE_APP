import { Prisma } from '@prisma/client';
import multer from 'multer';

const notFound = (req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found`);
  error.statusCode = 404;

  next(error);
};
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      err.statusCode = 413;
      err.message = 'Video is too large. Maximum size is 50 MB';
    } else if (err.code === 'LIMIT_FILE_COUNT') {
      err.statusCode = 400;
      err.message = 'Only one video can be uploaded';
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      err.statusCode = 400;
      err.message = 'Unexpected file field. Use the field name "video"';
    } else {
      err.statusCode = 400;
      err.message = err.message || 'Invalid file upload';
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    err.statusCode = 400;
    err.message = 'Invalid data provided';
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      const field = err.meta?.target?.[0] || 'field';

      err.statusCode = 400;
      err.message = `${field} already exists`;
    }

    if (err.code === 'P2025') {
      err.statusCode = 404;
      err.message = 'Record not found';
    }

    if (err.code === 'P2003') {
      err.statusCode = 400;
      err.message = 'Invalid reference: related record does not exist';
    }
  }

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
    }),
  });
};

export { notFound, errorHandler };
