import express from "express";
import cors from "cors";
import { initializeDatabase } from "./infrastructure/database/data-source";
import { createCategoryRouter } from "./presentation/routes/category.routes";
import { brandRouter } from "./presentation/routes/brand.routes";
import { productRouter } from "./presentation/routes/product.routes";
import { inventoryRouter } from "./presentation/routes/inventory.routes";
import { productImageRouter } from "./presentation/routes/product-image.routes";
import { config } from "./infrastructure/config/env";
import { uploadRouter } from "./presentation/routes/upload.routes";
import { setupSwagger } from "./infrastructure/config/swagger";
import { roleRouter } from "./presentation/routes/role.routes";
import { permissionRouter } from "./presentation/routes/permission.routes";
import { userRouter } from "./presentation/routes/user.routes";
import { authRouter } from "./presentation/routes/auth.routes";
import { createUserAddressRouter } from "./presentation/routes/user-address.routes";
import { createCartRouter } from "./presentation/routes/cart.routes";
import { createOrderRouter } from "./presentation/routes/order.routes";
import { createPaymentRouter } from "./presentation/routes/payment.routes";
import { createStoreRouter } from "./presentation/routes/store.routes";
import { createStoreAddressRouter } from "./presentation/routes/store-address.routes";
import { createChatRouter } from "./presentation/routes/chat.routes";
const startServer = async () => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  await initializeDatabase();
  setupSwagger(app);
  app.use("/api/auth", authRouter());
  app.use("/api/categories", createCategoryRouter());
  app.use("/api/brand", brandRouter());
  app.use("/api/products", productRouter());
  app.use("/api/inventories", inventoryRouter());
  app.use("/api/product-images", productImageRouter());
  app.use("/api/upload", uploadRouter());
  app.use("/api/roles", roleRouter());
  app.use("/api/permissions", permissionRouter());
  app.use("/api/users", userRouter());
  app.use("/api/user-addresses", createUserAddressRouter());
  app.use("/api/cart", createCartRouter());
  app.use("/api/orders", createOrderRouter());
  app.use("/api/payments", createPaymentRouter());
  app.use("/api/stores", createStoreRouter());
  app.use("/api/store-addresses", createStoreAddressRouter());
  app.use("/api/chat", createChatRouter());
  app.listen(config.port, () => {
    console.log(
      ` Server đang chạy thành công tại: http://localhost:${config.port}`,
    );
  });
};

startServer();
