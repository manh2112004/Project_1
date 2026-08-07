import { Request, Response, NextFunction } from "express";

export const authorize = (requiredPermission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const currentUser = (req as any).user;

    // 1. Kiểm tra xem người dùng đã đăng nhập chưa
    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: "Bạn chưa đăng nhập hoặc phiên làm việc đã hết hạn.",
      });
    }

    // 2. Tự động bỏ qua kiểm tra nếu là Super Admin
    if (
      currentUser.email === "admin@system.com" ||
      currentUser.roleCode === "SUPER_ADMIN"
    ) {
      return next();
    }

    // 3. Với các tài khoản khác: Kiểm tra mã quyền hạn trong JWT payload
    const userPermissions: string[] =
      currentUser.permissions || currentUser.permissionCodes || [];
    const hasPermission = userPermissions.includes(requiredPermission);
    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: `Bạn không có quyền [${requiredPermission}] để thực hiện hành động này.`,
      });
    }

    next();
  };
};

export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const currentUser = (req as any).user;

    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: "Bạn chưa đăng nhập hoặc phiên làm việc đã hết hạn.",
      });
    }

    if (
      currentUser.email === "admin@system.com" ||
      currentUser.roleCode === "SUPER_ADMIN"
    ) {
      return next();
    }

    const userRole = currentUser.roleCode || currentUser.role;
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền thực hiện hành động này.",
      });
    }

    next();
  };
};
