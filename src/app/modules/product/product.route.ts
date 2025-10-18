import express from 'express';
import { auth } from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ProductReviewControllers } from '../product-review/product-review.controller';
import { ProductReviewValidations } from '../product-review/product-review.validation';
import { USER_ROLE } from '../user/user.constant';
import { ProductControllers } from './product.controller';
import { ProductValidations } from './product.validation';

const router = express.Router();

router.post(
  '/create-product',
  auth(USER_ROLE.admin),
  validateRequest(ProductValidations.createProductValidationSchema),
  ProductControllers.createProduct,
);

router.get('/', ProductControllers.getAllProducts);
router.get('/:productSlug', ProductControllers.getSingleProduct);

router.patch(
  '/:productId',
  auth(USER_ROLE.admin),
  validateRequest(ProductValidations.updateProductValidationSchema),
  ProductControllers.updateProduct,
);

router.delete(
  '/:productId',
  auth(USER_ROLE.admin),
  ProductControllers.deleteProduct,
);

//? product review routes here------------------

router.post(
  '/:productId/reviews/create-review',
  validateRequest(ProductReviewValidations.createProductReviewValidationSchema),
  ProductReviewControllers.createReview,
);

router.get(
  '/:productId/reviews',
  ProductReviewControllers.getAllReviewsByProduct,
);

router.get('/reviews/all-reviews', ProductReviewControllers.getAllReviews);

router.get(
  '/:productId/reviews/:reviewId',
  ProductReviewControllers.getSingleReview,
);

router.patch(
  '/:productId/reviews/:reviewId',
  validateRequest(ProductReviewValidations.updateProductReviewValidationSchema),
  ProductReviewControllers.updateReview,
);

router.delete(
  '/:productId/reviews/:reviewId',
  ProductReviewControllers.deleteReview,
);

router.post(
  '/:productId/reviews/:reviewId/approved',
  ProductReviewControllers.approvedReview,
);

export const ProductRoutes = router;
