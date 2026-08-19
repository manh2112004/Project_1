import { Response } from "express";
import { DomainError } from "../../domain/errors/DomainError";

export class HttpResponseMapper {
  static sendError(res: Response, error: DomainError | any): void {
    const statusCode = error?.statusCode || 400;
    const code = error?.code || "REQUEST_FAILED";
    const message = error?.message || "Đã xảy ra lỗi khi xử lý yêu cầu.";
    const details = error?.details || null;

    res.status(statusCode).json({
      success: false,
      error: {
        code,
        message,
        statusCode,
        timestamp: new Date().toISOString(),
        details,
      },
    });
  }
}
