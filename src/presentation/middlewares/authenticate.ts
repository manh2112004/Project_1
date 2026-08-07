import { Request, Response, NextFunction } from "express";
import { JwtService } from "../../infrastructure/services/JwtService";
import { AppDataSource } from "../../infrastructure/database/data-source";
import { UserOrmEntity } from "../../infrastructure/database/entities/UserOrmEntity";

const jwtService = new JwtService();

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    let token: string | undefined;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (req.query.token) {
      token = req.query.token as string;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message:
          "Phiên làm việc không hợp lệ hoặc chưa cung cấp mã xác thực (Token).",
      });
    }

    const decodedPayload = jwtService.verifyToken(token);

    // Kiểm tra trạng thái kích hoạt / bị khóa của tài khoản trong CSDL
    const userRepo = AppDataSource.getRepository(UserOrmEntity);
    const user = await userRepo.findOne({
      where: { id: decodedPayload.id },
      select: { id: true, status: true },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Tài khoản không tồn tại trên hệ thống.",
      });
    }

    if (user.status === "BLOCKED") {
      return res.status(403).json({
        success: false,
        message: "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.",
      });
    }

    (req as any).user = decodedPayload;
    next();
  } catch (error: any) {
    return res.status(401).json({
      success: false,
      message:
        error.message || "Mã xác thực (Token) không hợp lệ hoặc đã hết hạn.",
    });
  }
};
