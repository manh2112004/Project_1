import { Request, Response, NextFunction } from "express";

export const safetyNetErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error("🔥 SYSTEM BUG / UNHANDLED EXCEPTION:", err);

  res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Đã xảy ra sự cố kỹ thuật hệ thống. Vui lòng thử lại sau.",
      statusCode: 500,
      timestamp: new Date().toISOString(),
    },
  });
};
