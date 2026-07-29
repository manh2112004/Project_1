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
const startServer = async () => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  await initializeDatabase();
  setupSwagger(app);
  app.use("/api/categories", createCategoryRouter());
  app.use("/api/brand", brandRouter());
  app.use("/api/products", productRouter());
  app.use("/api/inventories", inventoryRouter());
  app.use("/api/product-images", productImageRouter());
  app.use("/api/upload", uploadRouter());
  app.listen(config.port, () => {
    console.log(
      ` Server đang chạy thành công tại: http://localhost:${config.port}`,
    );
  });
};

startServer();
