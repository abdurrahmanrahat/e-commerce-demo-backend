import { model, Schema } from 'mongoose';
import { TProductReview } from './product-review.interface';

const productReviewSchema: Schema<TProductReview> = new Schema<TProductReview>(
  {
    name: {
      type: String,
      required: [true, 'User name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
    },
    images: {
      type: [String],
      required: [true, 'Product images are required'],
      default: [],
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Review must be associated with a product'],
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Minimum rating is 1'],
      max: [5, 'Maximum rating is 5'],
    },
    review: {
      type: String,
      required: [true, 'Review text is required'],
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const ProductReview = model<TProductReview>(
  'ProductReview',
  productReviewSchema,
);
