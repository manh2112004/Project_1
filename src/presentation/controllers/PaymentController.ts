import { Request, Response } from "express";
import { PayOSService } from "../../infrastructure/services/PayOSService";
import { IOrderRepository } from "../../domain/repositories/IOrderRepository";
import { MarkOrderAsPaidUseCase } from "../../application/use-cases/order/MarkOrderAsPaidUseCase";
import { OrderStatus } from "../../domain/constant/OrderEnums";

export class PaymentController {
  constructor(
    private readonly payOSService: PayOSService,
    private readonly orderRepository: IOrderRepository,
    private readonly markOrderAsPaidUseCase: MarkOrderAsPaidUseCase
  ) { }

  /**
   * API Tạo Link Thanh Toán PayOS (VietQR)
   */
  async createPayOSPaymentLink(req: Request, res: Response): Promise<void> {
    try {
      const { orderId } = req.body;
      if (!orderId) {
        res.status(400).json({
          success: false,
          message: "Mã đơn hàng (orderId) không được để trống.",
        });
        return;
      }

      const order = await this.orderRepository.findById(orderId);
      if (!order) {
        res.status(404).json({
          success: false,
          message: "Không tìm thấy thông tin đơn hàng.",
        });
        return;
      }

      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3001";

      const paymentLinkRes = await this.payOSService.createPaymentLink({
        orderId: order.id,
        orderCodeStr: order.orderCode,
        amount: order.finalAmount,
        description: `TT DH ${order.orderCode}`,
        returnUrl: `${frontendUrl}/orders?status=success&orderId=${order.id}`,
        cancelUrl: `${frontendUrl}/checkout?status=cancelled&orderId=${order.id}`,
      });

      res.status(200).json({
        success: true,
        message: "Tạo liên kết thanh toán PayOS thành công",
        data: {
          checkoutUrl: paymentLinkRes.checkoutUrl,
          paymentLinkId: paymentLinkRes.paymentLinkId,
          payosOrderCode: paymentLinkRes.payosOrderCode,
        },
      });
    } catch (error: any) {
      console.error("PayOS Create Payment Link Error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Tạo liên kết thanh toán PayOS thất bại.",
      });
    }
  }

  /**
   * API Webhook nhận thông báo chuyển tiền từ PayOS và tự động trừ kho
   */
  async handlePayOSWebhook(req: Request, res: Response): Promise<void> {
    try {
      const webhookData = await this.payOSService.verifyWebhookData(req.body);

      // WebhookData trả về dữ liệu đã xác thực chữ ký thành công
      if (webhookData) {
        console.log(
          `[PayOS Webhook] Nhận thanh toán thành công cho payosOrderCode: ${webhookData.orderCode}, Số tiền: ${webhookData.amount}`
        );

        // Tim đơn hàng khớp với payosOrderCode
        const { orders } = await this.orderRepository.findAndCount(1, 100, undefined, OrderStatus.PENDING);
        const targetOrder = orders.find(
          (order) => this.payOSService.generateNumericOrderCode(order.id) === webhookData.orderCode
        );

        if (targetOrder) {
          // Gọi Use Case chuyển trạng thái sang PAID và tự động trừ kho
          await this.markOrderAsPaidUseCase.execute(targetOrder.id);
          console.log(`[PayOS Webhook] Đã cập nhật đơn hàng ${targetOrder.orderCode} sang PAID và trừ kho thành công!`);
        } else {
          console.warn(`[PayOS Webhook] Không tìm thấy đơn hàng PENDING khớp với payosOrderCode: ${webhookData.orderCode}`);
        }
      }

      res.status(200).json({
        success: true,
        message: "Nhận webhook thành công",
      });
    } catch (error: any) {
      console.error("PayOS Webhook Error:", error);
      res.status(400).json({
        success: false,
        message: error.message || "Xác thực webhook thất bại.",
      });
    }
  }

  /**
   * API Thủ Công / Client Confirm Thanh Toán Đơn Hàng
   */
  async confirmPayOSPayment(req: Request, res: Response): Promise<void> {
    try {
      const { orderId } = req.body;
      if (!orderId) {
        res.status(400).json({
          success: false,
          message: "Mã đơn hàng (orderId) không được để trống.",
        });
        return;
      }

      const result = await this.markOrderAsPaidUseCase.execute(orderId);
      res.status(200).json({
        success: true,
        message: "Xác nhận thanh toán đơn hàng và trừ kho thành công",
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Xác nhận thanh toán thất bại.",
      });
    }
  }
}
