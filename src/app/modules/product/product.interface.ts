import { Document, Types } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string; // html string
  image: string;
  images: string[]; // Gallery
  category: string;
  price: number;
  stock: number;
  discount: Types.ObjectId | null;
  tags: string[];
  totalReviews?: number;
  averageRatings?: number;
  salesCount?: number; // update on order
  isDeleted?: boolean;
}

//? create those before creating product
// category
// discount

//? Extra, will come from user
// wishlist
// review
