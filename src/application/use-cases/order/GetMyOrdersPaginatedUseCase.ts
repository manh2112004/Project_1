import { IOrderRepository } from "../../../domain/repositories/IOrderRepository";
import { CreateOrderResponseDto } from "../../dtos/order/CreateOrderDto";
export interface PaginatedOrderResponse {
  orders: CreateOrderResponseDto[];
  meta: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}
export class GetMyOrdersPaginatedUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}
  async execute(
    userId: string,
    page: number,
    limit: number,
    search: string = "",
  ): Promise<PaginatedOrderResponse> {
    const validPage = page > 0 ? page : 1;
    const validLimit = limit > 0 ? limit : 1;
    const { orders, totalCount } =
      await this.orderRepository.findByUserIdPaginated(
        userId,
        validPage,
        validLimit,
        search,
      );
    const totalPages = Math.ceil(totalCount / validLimit);
    return {
      orders: orders.map((order) => ({
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
      })),
      meta: {
        totalCount,
        totalPages,
        currentPage: validPage,
        limit: validLimit,
      },
    };
  }
}
