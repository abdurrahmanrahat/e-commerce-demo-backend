import express from 'express';
import ValidateRequest from '../../middlewares/ValidateRequest';
import { OrderControllers } from './order.controller';
import { OrderValidations } from './order.validation';
// import auth from '../../middlewares/auth'; // Optional
// import { USER_ROLE } from '../../../constants/user'; // Optional

const router = express.Router();

router.post(
  '/create-order',
  ValidateRequest(OrderValidations.createOrderValidationSchema),
  OrderControllers.createOrder,
);

router.get(
  '/',
  // auth(USER_ROLE.admin),
  OrderControllers.getAllOrders,
);

router.get(
  '/:orderId',
  // auth(USER_ROLE.admin, USER_ROLE.customer),
  OrderControllers.getSingleOrder,
);

router.patch(
  '/:orderId',
  // auth(USER_ROLE.admin),
  ValidateRequest(OrderValidations.updateOrderValidationSchema),
  OrderControllers.updateOrder,
);

router.delete(
  '/:orderId',
  // auth(USER_ROLE.admin),
  OrderControllers.deleteOrder,
);

export const OrderRoutes = router;
