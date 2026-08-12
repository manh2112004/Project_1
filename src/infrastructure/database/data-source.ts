import "reflect-metadata";
import { DataSource } from "typeorm";
import { config } from "../config/env";
import { CategoryOrmEntity } from "./entities/CategoryOrmEntity";
import { BrandOrmEntity } from "./entities/BrandOrmEntity";
import { ProductOrmEntity } from "./entities/ProductOrmEntity";
import { InventoryOrmEntity } from "./entities/InventoryOrmEntity";
import { ProductImageOrmEntity } from "./entities/ProductImageOrmEntity";
import { RoleOrmEntity } from "./entities/RoleOrmEntity";
import { PermissionOrmEntity } from "./entities/PermissionOrmEntity";
import { UserOrmEntity } from "./entities/UserOrmEntity";

import { UserAddressOrmEntity } from "./entities/UserAddressOrmEntity";
import { OrderOrmEntity } from "./entities/OrderOrmEntity";
import { OrderItemOrmEntity } from "./entities/OrderItemOrmEntity";
import { UserSocialAccountOrmEntity } from "./entities/UserSocialAccountOrmEntity";
import { StoreOrmEntity } from "./entities/StoreOrmEntity";
import { StoreAddressOrmEntity } from "./entities/StoreAddressOrmEntity";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: config.db.host,
  port: config.db.port,
  username: config.db.username,
  password: config.db.password,
  database: config.db.database,
  // synchronize: true, // Tự động đồng bộ schema khi dev (Chỉ dùng trong môi trường dev)
  logging: config.db.logging,
  entities: [
    CategoryOrmEntity,
    BrandOrmEntity,
    ProductOrmEntity,
    InventoryOrmEntity,
    ProductImageOrmEntity,
    RoleOrmEntity,
    PermissionOrmEntity,
    UserOrmEntity,
    UserAddressOrmEntity,
    OrderOrmEntity,
    OrderItemOrmEntity,
    UserSocialAccountOrmEntity,
    StoreOrmEntity,
    StoreAddressOrmEntity,
  ],
  migrations: [__dirname + "/migrations/*{.ts,.js}"],
  subscribers: [],
});

export const initializeDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.log(" Kết nối Cơ sở dữ liệu PostgreSQL thành công!");
  } catch (error) {
    console.error(" Lỗi kết nối Cơ sở dữ liệu PostgreSQL:", error);
    process.exit(1);
  }
};
