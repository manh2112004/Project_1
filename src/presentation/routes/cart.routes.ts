import { Router } from "express";
import { redisClient } from "../../infrastructure/cache/redisClient";
import { RedisCartRepository } from "../../infrastructure/repositories/cart/RedisCartRepository";
import { AppDataSource } from "../../infrastructure/database/data-source";
import { ProductOrmEntity } from "../../infrastructure/database/entities/ProductOrmEntity";
import { TypeOrmProductRepository } from "../../infrastructure/repositories/product/TypeOrmProductRepository";

// Import các Use Cases
import { AddToCartUseCase } from "../../application/use-cases/cart/AddToCartUseCase";
import { GetCartUseCase } from "../../application/use-cases/cart/GetCartUseCase";
import { UpdateCartItemQuantityUseCase } from "../../application/use-cases/cart/UpdateCartItemQuantityUseCase";
import { RemoveCartItemUseCase } from "../../application/use-cases/cart/RemoveCartItemUseCase";
import { ClearCartUseCase } from "../../application/use-cases/cart/ClearCartUseCase";

// Import Controller & Middleware
import { CartController } from "../controllers/CartController";
import { authenticate } from "../middlewares/authenticate";

export const createCartRouter = (): Router => {
  const cartRouter = Router();

  // 1. Khởi tạo Repository ở tầng Infrastructure (dùng Redis làm bộ nhớ lưu trữ)
  const cartRepository = new RedisCartRepository(redisClient);
  const productOrmRepository = AppDataSource.getRepository(ProductOrmEntity);
  const productRepository = new TypeOrmProductRepository(productOrmRepository);

  // 2. Khởi tạo tất cả Use Cases ở tầng Application (Inject cartRepository, productRepository)
  const addToCartUseCase = new AddToCartUseCase(cartRepository, productRepository);
  const getCartUseCase = new GetCartUseCase(cartRepository);
  const updateCartItemQuantityUseCase = new UpdateCartItemQuantityUseCase(
    cartRepository,
  );
  const removeCartItemUseCase = new RemoveCartItemUseCase(cartRepository);
  const clearCartUseCase = new ClearCartUseCase(cartRepository);

  // 3. Khởi tạo Controller ở tầng Presentation (Inject tất cả Use Cases)
  const cartController = new CartController(
    addToCartUseCase,
    getCartUseCase,
    updateCartItemQuantityUseCase,
    removeCartItemUseCase,
    clearCartUseCase,
  );

  // 4. Áp dụng JWT Authentication Middleware (Yêu cầu đăng nhập trước khi dùng các API giỏ hàng)
  cartRouter.use(authenticate);

  cartRouter.get("/me", (req, res) => cartController.getMyCart(req, res));
  cartRouter.post("/items", (req, res) => cartController.addToCart(req, res));
  cartRouter.put("/items/:productId", (req, res) =>
    cartController.updateItemQuantity(req, res),
  );
  cartRouter.delete("/items/:productId", (req, res) =>
    cartController.removeItem(req, res),
  );
  cartRouter.delete("/clear", (req, res) => cartController.clearCart(req, res));

  return cartRouter;
};
