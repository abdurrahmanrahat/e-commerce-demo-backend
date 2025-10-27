import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { getNextOrderNumber } from '../../utils/getNextOrderNumber';
import { Product } from '../product/product.model';
import { orderSearchableFields } from './order.constants';
import { IOrder } from './order.interface';
import { Order } from './order.model';

const createOrderIntoDb = async (payload: IOrder) => {
  const orderNumber = await getNextOrderNumber();

  const session = await Order.startSession();

  try {
    session.startTransaction();

    for (const item of payload.orderItems) {
      const product = await Product.findById(item.product).session(session);

      if (!product || product.stock < item.quantity) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `Product does not exist or insufficient stock.`,
        );
      }

      product.salesCount = (product.salesCount as number) + item.quantity;

      product.stock -= item.quantity;
      await product.save({ session });
    }

    const createdOrder = await Order.create([{ ...payload, orderNumber }], {
      session,
    });

    await session.commitTransaction();
    session.endSession();

    return createdOrder[0];
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();

    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error.message || 'Unknown error',
    );
  }
};

const getOrdersFromDb = async (query: Record<string, unknown>) => {
  const baseQuery = Order.find({ isDeleted: false });

  const queryBuilder = new QueryBuilder(baseQuery, query)
    .search(orderSearchableFields) // you can adapt searchable fields
    .filter()
    .paginate()
    .sort();

  const orders = await queryBuilder.modelQuery
    .populate('orderItems.product')
    .sort({ createdAt: -1 });

  const countQuery = new QueryBuilder(Order.find({ isDeleted: false }), query)
    .search(orderSearchableFields) // match search fields
    .filter();

  const totalCount = (await countQuery.modelQuery).length;

  return { data: orders, totalCount };
};

const getSingleOrderFromDb = async (orderId: string) => {
  const order = await Order.findOne({
    _id: orderId,
    isDeleted: false,
  }).populate('orderItems.product');

  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, 'Order not found.');
  }

  return order;
};

const updateOrderIntoDb = async (orderId: string, payload: Partial<IOrder>) => {
  const updatedOrder = await Order.findByIdAndUpdate(orderId, payload, {
    new: true,
  });

  if (!updatedOrder) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Order not found or already deleted.',
    );
  }

  return updatedOrder;
};

const deleteOrderIntoDb = async (orderId: string) => {
  const session = await Order.startSession();

  try {
    session.startTransaction();

    const order = await Order.findOne({
      _id: orderId,
      isDeleted: false,
    }).session(session);

    if (!order) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        'Order not found or already deleted.',
      );
    }

    for (const item of order.orderItems) {
      const product = await Product.findById(item.product).session(session);

      if (product) {
        product.stock += item.quantity;

        product.salesCount = (product.salesCount as number) - item.quantity;
        await product.save({ session });
      }
    }

    order.isDeleted = true;
    await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    return order;
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();

    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error.message || 'Internal server error!',
    );
  }
};

export const OrderServices = {
  createOrderIntoDb,
  getOrdersFromDb,
  getSingleOrderFromDb,
  updateOrderIntoDb,
  deleteOrderIntoDb,
};
