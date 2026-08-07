import { IOrderRepository } from "../../../domain/repositories/IOrderRepository";
import { CancelOrderDto } from "../../dtos/order/CancelOrderDto";
import { CreateOrderResponseDto } from "../../dtos/order/CreateOrderDto";

export class AdminCancelOrderUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(dto: CancelOrderDto): Promise<CreateOrderResponseDto> {
    const order = await this.orderRepository.findById(dto.orderId);
    if (!order) {
      throw new Error("Đơn hàng không tồn tại.");
    }

    order.cancel(dto.cancelReason);
    const savedOrder = await this.orderRepository.save(order);

    return {
      id: savedOrder.id,
      userId: savedOrder.userId,
      orderCode: savedOrder.orderCode,
      status: savedOrder.status,
      totalAmount: savedOrder.totalAmount,
      discountAmount: savedOrder.discountAmount,
      shippingFee: savedOrder.shippingFee,
      finalAmount: savedOrder.finalAmount,
      paymentMethod: savedOrder.paymentMethod,
      paymentStatus: savedOrder.paymentStatus,
      recipientName: savedOrder.recipientName,
      phoneNumber: savedOrder.phoneNumber,
      shippingAddress: savedOrder.shippingAddress,
      shippingCode: savedOrder.shippingCode,
      customerNote: savedOrder.customerNote,
      cancelReason: savedOrder.cancelReason,
      items: (savedOrder.items || []).map((item) => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        createdAt: item.createdAt,
      })),
      createdAt: savedOrder.createdAt,
      updatedAt: savedOrder.updatedAt,
    };
  }
}
