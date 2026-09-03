import dotenv from "dotenv";
import path from "path";

// Đọc trực tiếp file .env.production của bạn
dotenv.config({ path: path.resolve(process.cwd(), ".env.production") });
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || "3000", 10),
  db: {
    url: process.env.DATABASE_URL || "",
    logging: process.env.DB_LOGGING === "true",
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
    apiKey: process.env.CLOUDINARY_API_KEY || "",
    apiSecret: process.env.CLOUDINARY_API_SECRET || "",
  },
  jwt: {
    secret: process.env.JWT_SECRET as string,
    refreshSecret: process.env.JWT_REFRESH_SECRET as string,
  },
  payos: {
    clientId: process.env.PAYOS_CLIENT_ID || "",
    apiKey: process.env.PAYOS_API_KEY || "",
    checksumKey: process.env.PAYOS_CHECKSUM_KEY || "",
  },
  redis: {
    url: process.env.REDIS_URL || "",
  },
};
