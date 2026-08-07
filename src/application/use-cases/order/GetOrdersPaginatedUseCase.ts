import { IOrderRepository } from "../../../domain/repositories/IOrderRepository";
import { OrderStatus } from "../../../domain/constant/OrderEnums";
import { CreateOrderResponseDto } from "../../dtos/order/CreateOrderDto";

export interface GetOrdersPaginatedInputDto {
  page: number;
  limit: number;
  search?: string;
  status?: OrderStatus;
}

export interface GetOrdersPaginatedOutputDto {
  orders: CreateOrderResponseDto[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export class GetOrdersPaginatedUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(
    input: GetOrdersPaginatedInputDto
  ): Promise<GetOrdersPaginatedOutputDto> {
    const page = input.page > 0 ? input.page : 1;
    const limit = input.limit > 0 ? input.limit : 10;

    const { orders, totalCount } = await this.orderRepository.findAndCount(
      page,
      limit,
      input.search,
      input.status
    );

    const mappedOrders: CreateOrderResponseDto[] = orders.map((order) => ({
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
    }));

    return {
      orders: mappedOrders,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      limit,
    };
  }
}
