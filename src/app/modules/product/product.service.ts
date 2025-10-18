import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { productSearchableFields } from './product.constants';
import { TProduct } from './product.interface';
import { Product } from './product.model';

const createProductIntoDB = async (payload: TProduct) => {
  const result = await Product.create(payload);
  return result;
};

const getProductsFromDB = async (query: Record<string, unknown>) => {
  // const result = await CategoryServices.getAllCategoriesFromDB();

  const productQuery = new QueryBuilder(
    Product.find({ isDeleted: false }),
    query,
  )
    .search(productSearchableFields)
    .filter()
    .paginate()
    .sort();

  const data = await productQuery.modelQuery.sort({ createdAt: -1 });

  const countQuery = new QueryBuilder(Product.find({ isDeleted: false }), query)
    .search(productSearchableFields)
    .filter();

  const totalCount = (await countQuery.modelQuery).length;

  return { data, totalCount };
};

const getSingleProductFromDB = async (productSlug: string) => {
  if (!productSlug) {
    throw new AppError(Number(httpStatus[400]), 'Missing product slug');
  }

  const result = await Product.findOne({ slug: productSlug, isDeleted: false });

  if (!result) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `Product with the slug '${productSlug}' is not found!`,
    );
  }

  return result;
};

const updateProductIntoDB = async (
  productId: string,
  payload: Partial<TProduct>,
) => {
  const isProductExists = Product.findById(productId).lean();

  if (!isProductExists) {
    throw new AppError(404, `Product with the id ${productId} is not found!`);
  }

  if (!payload || Object.keys(payload).length === 0) {
    throw new AppError(
      Number(httpStatus[400]),
      'Update payload cannot be empty!',
    );
  }

  const result = await Product.findByIdAndUpdate(productId, payload, {
    new: true,
  });
  return result;
};

const deleteProductIntoDB = async (productId: string) => {
  const product = await Product.findById(productId).lean();

  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product not found!');
  }

  const result = await Product.findByIdAndUpdate(
    productId,
    { isDeleted: true },
    { new: true },
  );

  return result;
};

export const ProductServices = {
  createProductIntoDB,
  getProductsFromDB,
  getSingleProductFromDB,
  updateProductIntoDB,
  deleteProductIntoDB,
};
