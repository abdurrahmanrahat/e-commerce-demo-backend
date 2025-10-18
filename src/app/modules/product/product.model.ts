import { model, Schema } from 'mongoose';
import { IProduct } from './product.interface';

const productSchema: Schema<IProduct> = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Product slug is required'],
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    image: {
      type: String,
      required: [true, 'Product image URL is required'],
      trim: true,
    },
    images: {
      type: [String],
      required: [true, 'Product images are required'],
      default: [],
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      trim: true,
    },
    stock: {
      type: Number,
      required: [true, 'Product stock quantity is required'],
      trim: true,
    },
    discount: {
      type: Schema.Types.ObjectId,
      ref: 'Discount',
      default: null,
    },
    tags: {
      type: [String],
      required: [true, 'Product tags are required'],
      default: [],
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    averageRatings: {
      type: Number,
      default: 0,
    },
    salesCount: {
      type: Number,
      default: 0,
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

export const Product = model<IProduct>('Product', productSchema);
