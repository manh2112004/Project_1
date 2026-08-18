import { Request, Response, NextFunction } from "express";
import { RateLimiterRedis } from "rate-limiter-flexible";
import { redisClient } from "../../infrastructure/cache/redisClient";

export interface RateLimiterOptions {
  points: number; // Số lượng request tối đa được phép
  duration: number; // Khoảng thời gian tính bằng giây (Window duration)
  blockDuration?: number; // Thời gian tạm khóa (tính bằng giây) nếu vi phạm (Default: 0)
  keyPrefix?: string; // Tiền tố Redis Key (Default: 'rl')
  keyGenerator?: (req: Request) => string; // Hàm tạo key định danh
  message?: string; // Thông báo lỗi tùy chỉnh
}

/**
 * Hàm tạo Express Rate Limiter Middleware linh hoạt bằng Redis
 */
export const createRateLimiter = (options: RateLimiterOptions) => {
  const limiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: options.keyPrefix || "rl_global",
    points: options.points,
    duration: options.duration,
    blockDuration: options.blockDuration || 0,
  });

  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    // Ưu tiên key từ keyGenerator -> user.id (nếu đã auth) -> IP client
    let key = options.keyGenerator ? options.keyGenerator(req) : "";

    if (!key) {
      const authUser = (req as any).user;
      const clientIp =
        (req.headers["x-forwarded-for"] as string)?.split(",")[0].trim() ||
        req.ip ||
        req.socket.remoteAddress ||
        "127.0.0.1";

      key = authUser?.id ? `user:${authUser.id}` : `ip:${clientIp}`;
    }

    try {
      await limiter.consume(key);
      next();
    } catch (rejRes: any) {
      const retryAfterSeconds = Math.ceil(
        (rejRes?.msBeforeNext || 1000) / 1000,
      );
      res.setHeader("Retry-After", String(retryAfterSeconds));
      res.status(429).json({
        success: false,
        message:
          options.message ||
          `Bạn đã thao tác quá nhiều lần. Vui lòng thử lại sau ${retryAfterSeconds} giây.`,
        retryAfterSeconds,
      });
    }
  };
};

/**
 * 1. Global Rate Limiter: Giới hạn chung 200 request / 1 phút per IP (chống DDoS/Spam API công khai)
 */
export const globalRateLimiter = createRateLimiter({
  keyPrefix: "rl_global",
  points: 200,
  duration: 60,
  message: "Hệ thống phát hiện lượt truy cập bất thường. Vui lòng chờ 1 phút.",
});

/**
 * 2. Login Rate Limiter: Tối đa 5 lần thử đăng nhập / 15 phút. Nếu vi phạm khóa 15 phút (900s).
 */
export const loginRateLimiter = createRateLimiter({
  keyPrefix: "rl_login",
  points: 5,
  duration: 900,
  blockDuration: 900,
  keyGenerator: (req) => {
    const email = req.body?.email
      ? String(req.body.email).toLowerCase().trim()
      : "";
    const clientIp =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0].trim() ||
      req.ip ||
      "127.0.0.1";
    return email ? `login:${email}` : `login_ip:${clientIp}`;
  },
  message: "Bạn đã thử đăng nhập sai quá 5 lần. Vui lòng thử lại sau 15 phút.",
});

/**
 * 3. Register Rate Limiter: Tối đa 3 lần đăng ký / 1 giờ per IP.
 */
export const registerRateLimiter = createRateLimiter({
  keyPrefix: "rl_register",
  points: 3,
  duration: 3600,
  blockDuration: 3600,
  message: "Bạn đã tạo tài khoản quá nhiều lần. Vui lòng thử lại sau 1 giờ.",
});

/**
 * 4. Upload Rate Limiter: Tối đa 10 lần upload file / 1 phút per User/IP.
 */
export const uploadRateLimiter = createRateLimiter({
  keyPrefix: "rl_upload",
  points: 10,
  duration: 60,
  message:
    "Bạn tải ảnh lên quá nhanh. Vui lòng chờ 1 phút trước khi tải ảnh tiếp.",
});

/**
 * 5. Payment Rate Limiter: Tối đa 5 lần tạo link thanh toán / 1 phút.
 */
export const paymentRateLimiter = createRateLimiter({
  keyPrefix: "rl_payment",
  points: 5,
  duration: 60,
  message:
    "Bạn đã yêu cầu tạo liên kết thanh toán quá nhiều lần. Vui lòng chờ 1 phút.",
});

/**
 * 6. Order Rate Limiter: Tối đa 3 lần đặt hàng (checkout) / 1 phút per User.
 */
export const orderRateLimiter = createRateLimiter({
  keyPrefix: "rl_order",
  points: 3,
  duration: 60,
  message:
    "Hệ thống đang xử lý đơn hàng của bạn. Vui lòng chờ 1 phút trước khi tạo đơn hàng mới.",
});
