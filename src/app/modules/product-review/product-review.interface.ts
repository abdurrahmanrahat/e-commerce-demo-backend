import { Types } from 'mongoose';

export type TProductReview = {
  name: string;
  email: string;
  images: string[];
  product: Types.ObjectId;
  rating: number;
  review: string;
  isVerified?: boolean;
  isDeleted?: boolean;
};

// make routes in product route like: /products/:productId/create-review , then comes rest in same
