import { z } from 'zod';

const createProductReviewValidationSchema = z.object({
  body: z.object({
    username: z.string({ required_error: 'Username is required' }),
    email: z.string().email({ message: 'Invalid email address' }).trim(),
    product: z.string({ required_error: 'Product ID is required' }),
    rating: z
      .number({ required_error: 'Rating is required' })
      .min(1, 'Rating must be at least 1')
      .max(5, 'Rating must be at most 5'),
    review: z.string().min(1, 'Review is required'),
  }),
});

const updateProductReviewValidationSchema = z.object({
  body: z.object({
    rating: z.number().min(1).max(5).optional(),
    review: z.string().optional(),
  }),
});

export const ProductReviewValidations = {
  createProductReviewValidationSchema,
  updateProductReviewValidationSchema,
};
