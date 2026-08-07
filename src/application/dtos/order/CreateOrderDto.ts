import { PaymentMethod, OrderStatus, PaymentStatus } from "../../../domain/constant/OrderEnums";

export interface CreateOrderDto {
  userId: string;
  recipientName: string;
  phoneNumber: string;
  shippingAddress: string;
  paymentMethod: PaymentMethod;
  customerNote?: string;
  productIds?: string[];
}

export interface CreateOrderItemResponseDto {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: Date;
}

export interface CreateOrderResponseDto {
  id: string;
  userId: string;
  orderCode: string;
  status: OrderStatus;
  totalAmount: number;
  discountAmount: number;
  shippingFee: number;
  finalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  recipientName: string;
  phoneNumber: string;
  shippingAddress: string;
  shippingCode: string | null;
  customerNote: string | null;
  cancelReason: string | null;
  items: CreateOrderItemResponseDto[];
  createdAt: Date;
  updatedAt: Date;
}
