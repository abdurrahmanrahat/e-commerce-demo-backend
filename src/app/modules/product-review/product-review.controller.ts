import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { ProductReviewServices } from './product-review.service';

const createReview = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductReviewServices.createReview(
    req.params.productId,
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Review make successfully',
    data: result,
  });
});

const getAllReviewsByProduct = catchAsync(
  async (req: Request, res: Response) => {
    const result = await ProductReviewServices.getReviews(
      req.params.productId,
      req.query,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'All reviews retrieved successfully',
      data: result,
    });
  },
);

const getAllReviews = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductReviewServices.getAllReviews(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All reviews retrieved successfully',
    data: result,
  });
});

const getSingleReview = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductReviewServices.getReviewById(
    req.params.productId,
    req.params.reviewId,
  );
  sendResponse(res, {
    statusCode: result ? httpStatus.OK : httpStatus.NOT_FOUND,
    success: !!result,
    message: result ? 'Review found' : 'Review not found',
    data: result,
  });
});

const updateReview = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductReviewServices.updateReview(
    req.params.productId,
    req.params.reviewId,
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review updated successfully',
    data: result,
  });
});

const deleteReview = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductReviewServices.deleteReview(
    req.params.productId,
    req.params.reviewId,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review deleted successfully',
    data: result,
  });
});

const approvedReview = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductReviewServices.approveReview(
    req.params.productId,
    req.params.reviewId,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review approved successfully',
    data: result,
  });
});

export const ProductReviewControllers = {
  createReview,
  getAllReviewsByProduct,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  approvedReview,
};
