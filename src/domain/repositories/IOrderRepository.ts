import { Order } from "../entities/Order";
import { OrderStatus } from "../constant/OrderEnums";

export interface IOrderRepository {
  save(order: Order): Promise<Order>;
  findById(id: string): Promise<Order | null>;
  findByOrderCode(orderCode: string): Promise<Order | null>;
  findByUserId(userId: string): Promise<Order[]>;
  /* Lấy danh sách đơn hàng của người dùng có phân trang */
  findByUserIdPaginated(
    userId: string,
    page: number,
    limit: number,
    search: string,
  ): Promise<{ orders: Order[]; totalCount: number }>;

  /* Dành cho Admin: Lấy danh sách đơn hàng toàn hệ thống (Có phân trang, tìm kiếm, lọc trạng thái) */
  findAndCount(
    page: number,
    limit: number,
    search?: string,
    status?: OrderStatus,
  ): Promise<{ orders: Order[]; totalCount: number }>;
}
