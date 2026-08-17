import dotenv from "dotenv";
import path from "path";

// Đọc trực tiếp file .env.production của bạn
dotenv.config({ path: path.resolve(process.cwd(), ".env.production") });
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || "3000", 10),
  db: {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432", 10),
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "Manh2004",
    database: process.env.DB_NAME || "adagroup",
    logging: process.env.DB_LOGGING === "true",
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
    apiKey: process.env.CLOUDINARY_API_KEY || "",
    apiSecret: process.env.CLOUDINARY_API_SECRET || "",
  },
  jwt: {
    secret: process.env.JWT_SECRET || "fallback_secret_cho_luc_dev",
    refreshSecret:
      process.env.JWT_REFRESH_SECRET || "super-secret-refresh-key-54321",
  },
  payos: {
    clientId: process.env.PAYOS_CLIENT_ID || "",
    apiKey: process.env.PAYOS_API_KEY || "",
    checksumKey: process.env.PAYOS_CHECKSUM_KEY || "",
  },
  redis: {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: parseInt(process.env.REDIS_PORT || "6379", 10),
    password: process.env.REDIS_PASSWORD || "",
  },
};
