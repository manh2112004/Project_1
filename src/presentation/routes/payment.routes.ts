import { Router } from "express";
import { AppDataSource } from "../../infrastructure/database/data-source";
import { OrderOrmEntity } from "../../infrastructure/database/entities/OrderOrmEntity";
import { InventoryOrmEntity } from "../../infrastructure/database/entities/InventoryOrmEntity";
import { TypeOrmOrderRepository } from "../../infrastructure/repositories/order/TypeOrmOrderRepository";
import { TypeOrmInventoryRepository } from "../../infrastructure/repositories/inventory/TypeOrmInventoryRepository";
import { PayOSService } from "../../infrastructure/services/PayOSService";
import { MarkOrderAsPaidUseCase } from "../../application/use-cases/order/MarkOrderAsPaidUseCase";
import { PaymentController } from "../controllers/PaymentController";
import { authenticate } from "../middlewares/authenticate";

export const createPaymentRouter = (): Router => {
  const router = Router();

  const orderRepository = new TypeOrmOrderRepository(
    AppDataSource.getRepository(OrderOrmEntity)
  );
  const inventoryRepository = new TypeOrmInventoryRepository(
    AppDataSource.getRepository(InventoryOrmEntity)
  );

  const payOSService = new PayOSService();
  const markOrderAsPaidUseCase = new MarkOrderAsPaidUseCase(
    orderRepository,
    inventoryRepository
  );

  const paymentController = new PaymentController(
    payOSService,
    orderRepository,
    markOrderAsPaidUseCase
  );

  // Endpoint tạo link thanh toán PayOS (yêu cầu đăng nhập)
  router.post("/payos/create-link", authenticate, (req, res) =>
    paymentController.createPayOSPaymentLink(req, res)
  );

  // Webhook từ PayOS (công khai, xác thực qua chữ ký HMAC)
  router.post("/payos/webhook", (req, res) =>
    paymentController.handlePayOSWebhook(req, res)
  );

  // Endpoint xác nhận đã thanh toán (dành cho client/admin)
  router.post("/payos/confirm", authenticate, (req, res) =>
    paymentController.confirmPayOSPayment(req, res)
  );

  return router;
};
