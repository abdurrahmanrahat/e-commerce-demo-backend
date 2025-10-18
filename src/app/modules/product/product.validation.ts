import { z } from 'zod';

const createProductValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Product name is required'),
    slug: z.string().min(1, 'Product slug is required'),
    description: z.string().min(1, 'Description is required'),
    image: z.string().min(1, 'Image URL is required'),
    images: z.array(z.string()).min(1, 'Images are required'),
    tags: z.array(z.string()).min(1, 'Tags are required'),
    category: z.string().min(1, 'Category is required'),
    price: z.number().min(0, 'Price must be 0 or more'),
    stock: z.number().min(0, 'Stock must be 0 or more'),
    discount: z.union([z.string(), z.literal(null)]), // assuming MongoDB ObjectId as string
  }),
});

const updateProductValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    slug: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    images: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    category: z.string().optional(),
    price: z.number().optional(),
    stock: z.number().optional(),
    discount: z.union([z.string(), z.literal(null)]).optional(),
  }),
});

export const ProductValidations = {
  createProductValidationSchema,
  updateProductValidationSchema,
};
