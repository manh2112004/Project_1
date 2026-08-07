import { IOrderRepository } from "../../../domain/repositories/IOrderRepository";
import { CreateOrderResponseDto } from "../../dtos/order/CreateOrderDto";

export class GetOrderByIdUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}
  async execute(id: string): Promise<CreateOrderResponseDto> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new Error("Đơn hàng không tồn tại");
    }
    return {
      id: order.id,
      userId: order.userId,
      orderCode: order.orderCode,
      status: order.status,
      totalAmount: order.totalAmount,
      discountAmount: order.discountAmount,
      shippingFee: order.shippingFee,
      finalAmount: order.finalAmount,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      recipientName: order.recipientName,
      phoneNumber: order.phoneNumber,
      shippingAddress: order.shippingAddress,
      shippingCode: order.shippingCode,
      customerNote: order.customerNote,
      cancelReason: order.cancelReason,
      items: (order.items || []).map((item) => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        createdAt: item.createdAt,
      })),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }
}
