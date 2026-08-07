import { Request, Response } from "express";
import { CreateOrderUseCase } from "../../application/use-cases/order/CreateOrderUseCase";
import { GetMyOrdersPaginatedUseCase } from "../../application/use-cases/order/GetMyOrdersPaginatedUseCase";
import { GetOrderByIdUseCase } from "../../application/use-cases/order/GetOrderByIdUseCase";
import { CancelMyOrderUseCase } from "../../application/use-cases/order/CancelMyOrderUseCase";
import { UpdateShippingAddressUseCase } from "../../application/use-cases/order/UpdateShippingAddressUseCase";
import { GetOrdersPaginatedUseCase } from "../../application/use-cases/order/GetOrdersPaginatedUseCase";
import { ConfirmOrderUseCase } from "../../application/use-cases/order/ConfirmOrderUseCase";
import { ShipOrderUseCase } from "../../application/use-cases/order/ShipOrderUseCase";
import { MarkOrderAsDeliveredUseCase } from "../../application/use-cases/order/MarkOrderAsDeliveredUseCase";
import { MarkOrderAsPaidUseCase } from "../../application/use-cases/order/MarkOrderAsPaidUseCase";
import { AdminCancelOrderUseCase } from "../../application/use-cases/order/AdminCancelOrderUseCase";
import { OrderStatus } from "../../domain/constant/OrderEnums";
import { sseManager } from "../../infrastructure/services/SseManager";

export class OrderController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly getMyOrdersPaginatedUseCase: GetMyOrdersPaginatedUseCase,
    private readonly getOrderByIdUseCase: GetOrderByIdUseCase,
    private readonly cancelMyOrderUseCase: CancelMyOrderUseCase,
    private readonly updateShippingAddressUseCase: UpdateShippingAddressUseCase,
    private readonly getOrdersPaginatedUseCase: GetOrdersPaginatedUseCase,
    private readonly confirmOrderUseCase: ConfirmOrderUseCase,
    private readonly shipOrderUseCase: ShipOrderUseCase,
    private readonly markOrderAsDeliveredUseCase: MarkOrderAsDeliveredUseCase,
    private readonly markOrderAsPaidUseCase: MarkOrderAsPaidUseCase,
    private readonly adminCancelOrderUseCase: AdminCancelOrderUseCase
  ) { }

  /** [Khách hàng] Đặt hàng (Checkout) */
  async checkout(req: Request, res: Response): Promise<void> {
    try {
      const currentUser = (req as any).user;
      const {
        recipientName,
        phoneNumber,
        shippingAddress,
        paymentMethod,
        customerNote,
        productIds,
      } = req.body;

      const order = await this.createOrderUseCase.execute({
        userId: currentUser.id,
        recipientName,
        phoneNumber,
        shippingAddress,
        paymentMethod,
        customerNote,
        productIds,
      });

      // Bắn sự kiện SSE đích danh cho chính Khách hàng vừa đặt hàng
      sseManager.sendToUser(currentUser.id, "order:updated", {
        type: "ORDER_CREATED",
        message: "Bạn đã đặt hàng thành công!",
        order,
      });

      res.status(201).json({
        success: true,
        message: "Đặt hàng thành công!",
        data: order,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Đặt hàng thất bại.",
      });
    }
  }

  /** [Khách hàng] Xem lịch sử đơn hàng của tôi có phân trang */
  async getMyOrders(req: Request, res: Response): Promise<void> {
    try {
      const currentUser = (req as any).user;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const result = await this.getMyOrdersPaginatedUseCase.execute(
        currentUser.id,
        page,
        limit
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Lấy lịch sử đơn hàng thất bại.",
      });
    }
  }

  /** [Khách hàng / Admin] Xem chi tiết 01 đơn hàng theo ID */
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const order = await this.getOrderByIdUseCase.execute(id);

      res.status(200).json({
        success: true,
        data: order,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Lấy chi tiết đơn hàng thất bại.",
      });
    }
  }

  /** [Khách hàng] Tự hủy đơn hàng của mình */
  async cancelMyOrder(req: Request, res: Response): Promise<void> {
    try {
      const currentUser = (req as any).user;
      const id = req.params.id as string;
      const { cancelReason } = req.body;

      const order = await this.cancelMyOrderUseCase.execute({
        orderId: id,
        userId: currentUser.id,
        cancelReason,
      });

      // Bắn sự kiện SSE đích danh cho chính người dùng sở hữu đơn hàng
      sseManager.sendToUser(currentUser.id, "order:updated", {
        type: "ORDER_CANCELLED",
        message: `Đơn hàng ${order.orderCode} đã hủy thành công.`,
        order,
      });

      res.status(200).json({
        success: true,
        message: "Hủy đơn hàng thành công.",
        data: order,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Hủy đơn hàng thất bại.",
      });
    }
  }

  /** [Khách hàng] Đổi thông tin địa chỉ giao hàng của đơn */
  async updateShippingAddress(req: Request, res: Response): Promise<void> {
    try {
      const currentUser = (req as any).user;
      const id = req.params.id as string;
      const { recipientName, phoneNumber, shippingAddress } = req.body;

      const order = await this.updateShippingAddressUseCase.execute({
        orderId: id,
        userId: currentUser.id,
        recipientName,
        phoneNumber,
        shippingAddress,
      });

      res.status(200).json({
        success: true,
        message: "Cập nhật địa chỉ nhận hàng thành công.",
        data: order,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Cập nhật địa chỉ nhận hàng thất bại.",
      });
    }
  }

  /** [Admin] Xem toàn bộ đơn hàng hệ thống (có phân trang, lọc, tìm kiếm) */
  async getAllOrders(req: Request, res: Response): Promise<void> {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const search = (req.query.search as string) || undefined;
      const status = (req.query.status as OrderStatus) || undefined;

      const result = await this.getOrdersPaginatedUseCase.execute({
        page,
        limit,
        search,
        status,
      });

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Lấy danh sách đơn hàng thất bại.",
      });
    }
  }

  /** [Admin] Duyệt / Xác nhận đơn hàng (PENDING -> PROCESSING) */
  async confirmOrder(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const order = await this.confirmOrderUseCase.execute(id);

      // Bắn sự kiện SSE đích danh cho Khách hàng sở hữu đơn này
      sseManager.sendToUser(order.userId, "order:updated", {
        type: "ORDER_CONFIRMED",
        message: `Đơn hàng ${order.orderCode} đã được Admin duyệt và đang chuẩn bị hàng!`,
        order,
      });

      res.status(200).json({
        success: true,
        message: "Xác nhận duyệt đơn hàng thành công.",
        data: order,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Xác nhận duyệt đơn hàng thất bại.",
      });
    }
  }

  /** [Admin] Bàn giao đơn cho vận chuyển (PROCESSING -> SHIPPED) */
  async shipOrder(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const { shippingCode } = req.body;

      const order = await this.shipOrderUseCase.execute({
        orderId: id,
        shippingCode,
      });

      // Bắn sự kiện SSE đích danh cho Khách hàng sở hữu đơn này
      sseManager.sendToUser(order.userId, "order:updated", {
        type: "ORDER_SHIPPED",
        message: `Đơn hàng ${order.orderCode} đã được bàn giao cho đơn vị vận chuyển (Mã vận đơn: ${shippingCode})!`,
        order,
      });

      res.status(200).json({
        success: true,
        message: "Chuyển đơn hàng sang trạng thái Đang vận chuyển thành công.",
        data: order,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Bàn giao vận chuyển thất bại.",
      });
    }
  }

  /** [Admin/Shipper] Xác nhận giao hàng thành công (SHIPPED -> DELIVERED) */
  async markAsDelivered(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const order = await this.markOrderAsDeliveredUseCase.execute(id);

      // Bắn sự kiện SSE đích danh cho Khách hàng sở hữu đơn này
      sseManager.sendToUser(order.userId, "order:updated", {
        type: "ORDER_DELIVERED",
        message: `Đơn hàng ${order.orderCode} đã được giao thành công! Cảm ơn bạn đã mua hàng.`,
        order,
      });

      res.status(200).json({
        success: true,
        message: "Đánh dấu giao hàng thành công.",
        data: order,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Cập nhật trạng thái giao hàng thất bại.",
      });
    }
  }

  /** [Admin/Webhook] Cập nhật thanh toán thành công (PAID) */
  async markAsPaid(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const order = await this.markOrderAsPaidUseCase.execute(id);

      // Bắn sự kiện SSE đích danh cho Khách hàng sở hữu đơn này
      sseManager.sendToUser(order.userId, "order:updated", {
        type: "ORDER_PAID",
        message: `Đơn hàng ${order.orderCode} đã được xác nhận thanh toán thành công!`,
        order,
      });

      res.status(200).json({
        success: true,
        message: "Cập nhật trạng thái đã thanh toán thành công.",
        data: order,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Cập nhật thanh toán thất bại.",
      });
    }
  }

  /** [Admin] Hủy đơn hàng bất kỳ */
  async adminCancelOrder(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const { cancelReason } = req.body;

      const order = await this.adminCancelOrderUseCase.execute({
        orderId: id,
        cancelReason,
      });

      // Bắn sự kiện SSE đích danh cho Khách hàng sở hữu đơn này
      sseManager.sendToUser(order.userId, "order:updated", {
        type: "ADMIN_CANCELLED_ORDER",
        message: `Đơn hàng ${order.orderCode} đã bị Admin hủy với lý do: ${cancelReason}`,
        order,
      });

      res.status(200).json({
        success: true,
        message: "Admin hủy đơn hàng thành công.",
        data: order,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Hủy đơn hàng thất bại.",
      });
    }
  }
}
