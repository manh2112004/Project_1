// src/presentation/middlewares/AuthMiddleware.ts
import { Request, Response, NextFunction } from "express";
import { SystemRole } from "../../domain/constant/SystemRole ";

export const authorize = (requiredPermission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const currentUser = (req as any).user; // Ép kiểu sang any để tránh lỗi TS

    // Kiểm tra xem người dùng đã đăng nhập chưa
    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: "Bạn chưa đăng nhập hoặc phiên làm việc đã hết hạn.",
      });
    }
    // Với các vai trò khác: Kiểm tra danh sách quyền
    const hasPermission = currentUser.permissions.includes(requiredPermission);
    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền thực hiện hành động này.",
      });
    }
    next();
  };
};
