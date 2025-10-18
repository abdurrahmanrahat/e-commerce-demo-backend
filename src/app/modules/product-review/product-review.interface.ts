import { Document, Types } from 'mongoose';

export interface IProductReview extends Document {
  username: string;
  email: string;
  product: Types.ObjectId;
  rating: number;
  review: string;
  isVerified?: boolean;
  isDeleted?: boolean;
}

// make routes in product route like: /products/:productId/create-review , then comes rest in same
