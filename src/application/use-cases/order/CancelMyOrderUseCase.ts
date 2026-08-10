import { IOrderRepository } from "../../../domain/repositories/IOrderRepository";
import { IInventoryRepository } from "../../../domain/repositories/IInventoryRepository";
import { OrderStatus } from "../../../domain/constant/OrderEnums";
import { CancelOrderDto } from "../../dtos/order/CancelOrderDto";
import { CreateOrderResponseDto } from "../../dtos/order/CreateOrderDto";

export class CancelMyOrderUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly inventoryRepository?: IInventoryRepository
  ) {}

  async execute(dto: CancelOrderDto): Promise<CreateOrderResponseDto> {
    const order = await this.orderRepository.findById(dto.orderId);
    if (!order) {
      throw new Error("Đơn hàng không tồn tại.");
    }

    if (dto.userId && order.userId !== dto.userId) {
      throw new Error("Bạn không có quyền hủy đơn hàng này.");
    }

    const previousStatus = order.status;
    order.cancel(dto.cancelReason);

    // Hoàn trả số lượng tồn kho nếu đơn hàng bị hủy từ trạng thái chưa giao
    if (
      previousStatus !== OrderStatus.CANCELLED &&
      this.inventoryRepository &&
      order.items &&
      order.items.length > 0
    ) {
      for (const item of order.items) {
        const inventory = await this.inventoryRepository.findByProductId(item.productId);
        if (inventory) {
          inventory.update({ quantity: inventory.quantity + item.quantity });
          await this.inventoryRepository.save(inventory);
        }
      }
    }

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
