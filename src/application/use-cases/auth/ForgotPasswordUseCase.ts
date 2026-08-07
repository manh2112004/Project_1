import { Redis } from "ioredis";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { EmailService } from "../../../infrastructure/services/EmailService";

export interface ForgotPasswordInput {
  email: string;
}

export class ForgotPasswordUseCase {
  private readonly OTP_TTL_SECONDS = 300; // 5 phút
  private readonly COOLDOWN_SECONDS = 60; // 60s
  private readonly MAX_DAILY_OTP = 5;

  constructor(
    private readonly userRepository: IUserRepository,
    private readonly redis: Redis,
    private readonly emailService: EmailService,
  ) {}

  async execute(input: ForgotPasswordInput): Promise<void> {
    const cleanEmail = input.email ? input.email.toLowerCase().trim() : "";
    if (!cleanEmail) {
      throw new Error("Email không được để trống.");
    }

    // 1. Tìm user trong CSDL (Chống Account Enumeration: nếu không thấy vẫn giả lập thành công)
    const existingUser = await this.userRepository.findByEmail(cleanEmail);
    if (!existingUser) {
      console.log(`[ForgotPasswordUseCase] Email ${cleanEmail} không tồn tại trong hệ thống. Bỏ qua gửi OTP.`);
      return;
    }

    // 2. Kiểm tra Cooldown 60s trên Redis
    const cooldownKey = `otp:forgot_pass_cooldown:${cleanEmail}`;
    const isCooldown = await this.redis.get(cooldownKey);
    if (isCooldown) {
      const ttl = await this.redis.ttl(cooldownKey);
      throw new Error(
        `Vui lòng đợi ${ttl > 0 ? ttl : 60} giây trước khi yêu cầu mã OTP mới.`,
      );
    }

    // 3. Kiểm tra giới hạn 5 lần/ngày
    const dailyKey = `otp:forgot_pass_daily:${cleanEmail}`;
    const dailyCountStr = await this.redis.get(dailyKey);
    const dailyCount = dailyCountStr ? parseInt(dailyCountStr, 10) : 0;
    if (dailyCount >= this.MAX_DAILY_OTP) {
      throw new Error(
        `Bạn đã vượt quá giới hạn ${this.MAX_DAILY_OTP} lần yêu cầu OTP trong ngày. Vui lòng thử lại sau 24 giờ.`,
      );
    }

    // 4. Sinh mã OTP 6 số ngẫu nhiên
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // 5. Lưu OTP vào Redis (Key: otp:forgot_pass:${cleanEmail}, TTL 5 phút)
    const otpKey = `otp:forgot_pass:${cleanEmail}`;
    await this.redis.set(otpKey, otpCode, "EX", this.OTP_TTL_SECONDS);

    // 6. Đặt Cooldown 60s & tăng đếm daily
    await this.redis.set(cooldownKey, "1", "EX", this.COOLDOWN_SECONDS);
    const newDailyCount = await this.redis.incr(dailyKey);
    if (newDailyCount === 1) {
      await this.redis.expire(dailyKey, 86400);
    }

    // 7. Gửi email chứa mã OTP khôi phục mật khẩu
    await this.emailService.sendForgotPasswordOtpEmail(cleanEmail, otpCode);
  }
}
