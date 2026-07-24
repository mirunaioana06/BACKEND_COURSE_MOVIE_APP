import { z } from 'zod';

const reviewSchema = z.object({
  rating: z.coerce
    .number()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5')
    .refine((value) => Number.isInteger(value * 2), {
      message: 'Rating must increase in steps of 0.5',
    }),
});

export { reviewSchema };
