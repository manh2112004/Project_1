import { Router } from "express";
import { AppDataSource } from "../../infrastructure/database/data-source";
import { OrderOrmEntity } from "../../infrastructure/database/entities/OrderOrmEntity";
import { ProductOrmEntity } from "../../infrastructure/database/entities/ProductOrmEntity";
import { InventoryOrmEntity } from "../../infrastructure/database/entities/InventoryOrmEntity";
import { TypeOrmOrderRepository } from "../../infrastructure/repositories/order/TypeOrmOrderRepository";
import { TypeOrmProductRepository } from "../../infrastructure/repositories/product/TypeOrmProductRepository";
import { TypeOrmInventoryRepository } from "../../infrastructure/repositories/inventory/TypeOrmInventoryRepository";
import { RedisCartRepository } from "../../infrastructure/repositories/cart/RedisCartRepository";
import { redisClient } from "../../infrastructure/cache/redisClient";
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
import { OrderController } from "../controllers/OrderController";
import { authenticate } from "../middlewares/authenticate";
import { authorize } from "../middlewares/authorize";
import { orderRateLimiter } from "../middlewares/rateLimiter";

export const createOrderRouter = (): Router => {
  const router = Router();

  // Khởi tạo các Repository
  const cartRepository = new RedisCartRepository(redisClient);
  const productRepository = new TypeOrmProductRepository(
    AppDataSource.getRepository(ProductOrmEntity)
  );
  const inventoryRepository = new TypeOrmInventoryRepository(
    AppDataSource.getRepository(InventoryOrmEntity)
  );
  const orderRepository = new TypeOrmOrderRepository(
    AppDataSource.getRepository(OrderOrmEntity)
  );

  // Khởi tạo các Use Cases
  const createOrderUseCase = new CreateOrderUseCase(
    cartRepository,
    inventoryRepository,
    productRepository,
    orderRepository
  );
  const getMyOrdersPaginatedUseCase = new GetMyOrdersPaginatedUseCase(orderRepository);
  const getOrderByIdUseCase = new GetOrderByIdUseCase(orderRepository);
  const cancelMyOrderUseCase = new CancelMyOrderUseCase(
    orderRepository,
    inventoryRepository
  );
  const updateShippingAddressUseCase = new UpdateShippingAddressUseCase(orderRepository);
  const getOrdersPaginatedUseCase = new GetOrdersPaginatedUseCase(orderRepository);
  const confirmOrderUseCase = new ConfirmOrderUseCase(orderRepository);
  const shipOrderUseCase = new ShipOrderUseCase(orderRepository);
  const markOrderAsDeliveredUseCase = new MarkOrderAsDeliveredUseCase(orderRepository);
  const markOrderAsPaidUseCase = new MarkOrderAsPaidUseCase(
    orderRepository,
    inventoryRepository
  );
  const adminCancelOrderUseCase = new AdminCancelOrderUseCase(
    orderRepository,
    inventoryRepository
  );

  // Khởi tạo Controller
  const orderController = new OrderController(
    createOrderUseCase,
    getMyOrdersPaginatedUseCase,
    getOrderByIdUseCase,
    cancelMyOrderUseCase,
    updateShippingAddressUseCase,
    getOrdersPaginatedUseCase,
    confirmOrderUseCase,
    shipOrderUseCase,
    markOrderAsDeliveredUseCase,
    markOrderAsPaidUseCase,
    adminCancelOrderUseCase
  );

  // Yêu cầu xác thực Token JWT cho tất cả các API Order
  router.use(authenticate);

  // Endpoints Khách hàng (Rate limit 3 đơn / phút)
  router.post("/checkout", orderRateLimiter, (req, res) => orderController.checkout(req, res));
  router.get("/me", (req, res) => orderController.getMyOrders(req, res));
  router.get("/:id", (req, res) => orderController.getById(req, res));
  router.put("/:id/cancel", (req, res) => orderController.cancelMyOrder(req, res));
  router.put("/:id/address", (req, res) => orderController.updateShippingAddress(req, res));

  // Endpoints dành riêng cho Quản trị đơn hàng
  router.get("/", authorize("READ_ORDER"), (req, res) => orderController.getAllOrders(req, res));
  router.put("/:id/confirm", authorize("UPDATE_ORDER_STATUS"), (req, res) => orderController.confirmOrder(req, res));
  router.put("/:id/ship", authorize("UPDATE_ORDER_STATUS"), (req, res) => orderController.shipOrder(req, res));
  router.put("/:id/deliver", authorize("UPDATE_ORDER_STATUS"), (req, res) => orderController.markAsDelivered(req, res));
  router.put("/:id/pay", authorize("UPDATE_ORDER_STATUS"), (req, res) => orderController.markAsPaid(req, res));
  router.put("/:id/admin-cancel", authorize("CANCEL_ORDER"), (req, res) => orderController.adminCancelOrder(req, res));

  return router;
};
