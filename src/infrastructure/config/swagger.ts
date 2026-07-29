import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import path from "path";
const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-Commerce API Documentation",
      version: "1.0.0",
      description: "Tài liệu API cho dự án E-commerce",
    },
    servers: [
      {
        url: "http://localhost:3000/api", // Đường dẫn gốc (Prefix) của API
        description: "Development Server",
      },
    ],
    // Cấu hình JWT Bearer Token trong Swagger UI
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  // Đường dẫn quét các ghi chú (JSDoc comments) để tự động tạo document
  apis: ["./src/presentation/docs/*.ts", "./src/presentation/docs/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);
export const setupSwagger = (app: Express): void => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(" Swagger Docs sẵn sàng tại: http://localhost:3000/api-docs");
};
