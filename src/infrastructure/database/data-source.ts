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
import { ConversationOrmEntity } from "./entities/ConversationOrmEntity";
import { MessageOrmEntity } from "./entities/MessageOrmEntity";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: config.db.url || process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  logging: config.db.logging,
  synchronize: true,
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
    ConversationOrmEntity,
    MessageOrmEntity,
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
