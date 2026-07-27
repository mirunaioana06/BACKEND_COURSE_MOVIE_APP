import { z } from 'zod';

const movieFields = {
  title: z.string().trim().min(1, 'Title is required').max(200),

  overview: z.string().trim().max(5000).nullable().optional(),

  releaseYear: z.coerce
    .number()
    .int()
    .min(1888, 'Release year must be at least 1888')
    .max(2100, 'Release year must be at most 2100'),

  genres: z.array(z.string().trim().min(1)).max(20).optional(),

  runtime: z.coerce.number().int().positive().max(1000).nullable().optional(),

  posterUrl: z.string().url('Poster URL must be valid').nullable().optional(),
};

const createMovieSchema = z.object(movieFields);

const updateMovieSchema = z
  .object(movieFields)
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });

export { createMovieSchema, updateMovieSchema };
