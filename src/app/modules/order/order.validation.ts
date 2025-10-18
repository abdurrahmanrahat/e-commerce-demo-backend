import { z } from 'zod';
import { ORDER_STATUS_VALUES } from './order.constants';

const orderItemSchema = z.object({
  product: z
    .string({ required_error: 'Product ID is required' })
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid Product ID format'),
  quantity: z
    .number({ required_error: 'Quantity is required' })
    .min(1, 'Quantity must be at least 1'),
});

const createOrderValidationSchema = z.object({
  body: z.object({
    fullName: z
      .string({ required_error: 'Full name is required' })
      .min(1, 'Full name cannot be empty')
      .trim(),
    fullAddress: z
      .string({ required_error: 'Full address is required' })
      .min(1, 'Full address cannot be empty')
      .trim(),
    phoneNo: z
      .string({ required_error: 'Phone number is required' })
      .min(6, 'Phone number must be valid'),
    email: z
      .string({ required_error: 'Email is required' })
      .email({ message: 'Invalid email address' })
      .trim(),
    country: z
      .string({ required_error: 'Country is required' })
      .min(1, 'Country cannot be empty'),
    orderNotes: z.string().optional().default(''),
    insideDhaka: z.boolean({
      required_error: 'Shipping location flag is required',
    }),
    orderItems: z
      .array(orderItemSchema)
      .min(1, 'At least one order item is required'),
    totalPrice: z
      .number({ required_error: 'Total price is required' })
      .min(0, 'Total price must be non-negative'),
    paymentMethod: z.enum(['CASH-ON-DELIVERY', 'DIGITAL-PAYMENT'], {
      required_error: 'Payment method is required',
      invalid_type_error:
        'Payment method must be either CASH-ON-DELIVERY or DIGITAL-PAYMENT',
    }),
  }),
});

const updateOrderValidationSchema = z.object({
  body: z.object({
    fullName: z.string().min(1).optional(),
    fullAddress: z.string().min(1).optional(),
    phoneNo: z.string().min(6).optional(),
    email: z.string().email().optional(),
    country: z.string().min(1).optional(),
    orderNotes: z.string().optional(),
    insideDhaka: z.boolean().optional(),
    //   orderItems: z.array(orderItemSchema).optional(),
    //   totalPrice: z.number().min(0).optional(),
    status: z.enum(ORDER_STATUS_VALUES).optional(),
    paymentMethod: z.enum(['CASH-ON-DELIVERY', 'DIGITAL-PAYMENT']).optional(),
    isDeleted: z.boolean().optional(),
  }),
  // .refine((data) => Object.keys(data).length > 0, {
  //   message: 'At least one field must be provided for update',
  // }),
});

export const OrderValidations = {
  createOrderValidationSchema,
  updateOrderValidationSchema,
};
