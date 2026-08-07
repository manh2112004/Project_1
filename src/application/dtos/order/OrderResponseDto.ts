import { OrderStatus, PaymentMethod, PaymentStatus } from "../../../domain/constant/OrderEnums";

export interface OrderItemResponseDto {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: Date;
}

export interface OrderResponseDto {
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
  items: OrderItemResponseDto[];
  createdAt: Date;
  updatedAt: Date;
}
