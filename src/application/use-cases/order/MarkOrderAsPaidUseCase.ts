import { IOrderRepository } from "../../../domain/repositories/IOrderRepository";
import { IInventoryRepository } from "../../../domain/repositories/IInventoryRepository";
import { PaymentStatus } from "../../../domain/constant/OrderEnums";
import { CreateOrderResponseDto } from "../../dtos/order/CreateOrderDto";

export class MarkOrderAsPaidUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly inventoryRepository?: IInventoryRepository
  ) { }

  async execute(orderId: string): Promise<CreateOrderResponseDto> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new Error("Đơn hàng không tồn tại.");
    }

    // Nếu đơn hàng chưa được đánh dấu thanh toán
    if (order.paymentStatus !== PaymentStatus.PAID) {
      order.markAsPaid(); // Cập nhật paymentStatus -> PAID

      // Thực hiện trừ kho từng sản phẩm trong đơn hàng
      if (this.inventoryRepository && order.items && order.items.length > 0) {
        for (const item of order.items) {
          const inventory = await this.inventoryRepository.findByProductId(item.productId);
          if (inventory) {
            inventory.deductQuantity(item.quantity);
            await this.inventoryRepository.save(inventory);
          }
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
