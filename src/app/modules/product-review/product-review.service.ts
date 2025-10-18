import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { Product } from '../product/product.model';
import { IProductReview } from './product-review.interface';
import { ProductReview } from './product-review.model';

const createReview = async (productId: string, payload: IProductReview) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product not found.');
  }

  try {
    const review = await ProductReview.create({
      ...payload,
      product: productId,
    });
    return review;
  } catch (error) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Error occurred while creating review',
    );
  }
};

const getReviews = async (
  productId: string,
  query: Record<string, unknown>,
) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product is not found');
  }

  const reviewQuery = new QueryBuilder(
    ProductReview.find({
      isDeleted: false,
      product: productId,
    }),
    query,
  )
    .search(['username', 'email']) // optional
    .filter()
    .paginate();

  const data = await reviewQuery.modelQuery.sort({ createdAt: -1 });

  const totalCount = (
    await new QueryBuilder(
      ProductReview.find({ isDeleted: false, product: productId }),
      query,
    )
      .search(['username', 'email'])
      .filter().modelQuery
  ).length;

  return { data, totalCount };
};

const getAllReviews = async (query: Record<string, unknown>) => {
  const reviewQuery = new QueryBuilder(
    ProductReview.find({ isDeleted: false }),
    query,
  )
    .search(['username', 'email']) // optional
    .filter()
    .paginate();

  const data = await reviewQuery.modelQuery
    .populate('product')
    .sort({ createdAt: -1 });

  const totalCount = (
    await new QueryBuilder(ProductReview.find({ isDeleted: false }), query)
      .search(['username', 'email'])
      .filter().modelQuery
  ).length;

  return { data, totalCount };
};

const getReviewById = async (productId: string, reviewId: string) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product is not found');
  }

  return await ProductReview.findOne({ _id: reviewId, isDeleted: false });
};

const updateReview = async (
  productId: string,
  reviewId: string,
  payload: Partial<IProductReview>,
) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product is not found');
  }

  return await ProductReview.findOneAndUpdate(
    { _id: reviewId, isDeleted: false },
    payload,
    { new: true },
  );
};

const deleteReview = async (productId: string, reviewId: string) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
  }

  const session = await ProductReview.startSession();

  try {
    session.startTransaction();

    // Soft delete the review
    const deletedReview = await ProductReview.findOneAndUpdate(
      { _id: reviewId, isDeleted: { $ne: true } },
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedReview) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        'Review not found or already deleted',
      );
    }

    // Recalculate reviews count (only non-deleted)
    const reviewsCount = await ProductReview.countDocuments({
      product: product._id,
      isDeleted: { $ne: true },
    }).session(session);

    // Recalculate average rating (only non-deleted)
    const averageRatings = await ProductReview.aggregate([
      {
        $match: {
          product: product._id,
          isDeleted: { $ne: true },
        },
      },
      {
        $group: {
          _id: '$product',
          averageRating: { $avg: '$rating' },
        },
      },
    ]).session(session);

    const avgRating = averageRatings[0]?.averageRating || 0;
    const avgRatingWithTwoDecimal = parseFloat(avgRating.toFixed(2));

    await Product.findByIdAndUpdate(
      { _id: productId },
      {
        totalReviews: reviewsCount,
        averageRatings: avgRatingWithTwoDecimal,
      },
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    return deletedReview;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to delete review',
    );
  }
};

const approveReview = async (productId: string, reviewId: string) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product not found.');
  }

  const session = await ProductReview.startSession();

  try {
    session.startTransaction();

    const updatedReview = await ProductReview.findOneAndUpdate(
      { _id: reviewId, isDeleted: false, isVerified: { $ne: true } },
      { isVerified: true },
      { new: true, session },
    );

    if (!updatedReview) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        'Review not found or already verified',
      );
    }

    // Recalculate verified + non-deleted reviews
    const reviewsCount = await ProductReview.countDocuments({
      product: productId,
      isDeleted: false,
      isVerified: true,
    }).session(session);

    const averageRatings = await ProductReview.aggregate([
      {
        $match: {
          product: product._id,
          isDeleted: false,
          isVerified: true,
        },
      },
      {
        $group: {
          _id: '$product',
          averageRating: { $avg: '$rating' },
        },
      },
    ]).session(session);

    const avgRating = averageRatings[0]?.averageRating || 0;
    const avgRatingWithTwoDecimal = parseFloat(avgRating.toFixed(2));

    await Product.findByIdAndUpdate(
      { _id: productId },
      {
        totalReviews: reviewsCount,
        averageRatings: avgRatingWithTwoDecimal,
      },
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    return updatedReview;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to approve review',
    );
  }
};

export const ProductReviewServices = {
  createReview,
  getReviews,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
  approveReview,
};
