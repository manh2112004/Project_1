import { Redis } from "ioredis";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { EmailService } from "../../../infrastructure/services/EmailService";

export class SendOtpUseCase {
  private readonly OTP_TTL_SECONDS = 300; // Mã OTP có hiệu lực 5 phút
  private readonly COOLDOWN_SECONDS = 60; // Khoảng thời gian giãn cách giữa 2 lần gửi (60s)
  private readonly MAX_DAILY_OTP = 5; // Giới hạn tối đa 5 lần gửi OTP / 24h

  constructor(
    private readonly userRepository: IUserRepository,
    private readonly redis: Redis,
    private readonly emailService: EmailService,
  ) {}

  async execute(email: string): Promise<void> {
    const cleanEmail = email.toLowerCase().trim();

    if (!cleanEmail) {
      throw new Error("Email không được để trống.");
    }

    // 1. Kiểm tra Email xem đã có tài khoản nào đăng ký chưa
    const existingUser = await this.userRepository.findByEmail(cleanEmail);
    if (existingUser) {
      throw new Error("Email này đã được sử dụng bởi tài khoản khác.");
    }

    // 2. Kiểm tra Cooldown 60s (Tránh bấm spam nút Gửi liên tục)
    const cooldownKey = `otp:cooldown:${cleanEmail}`;
    const isCooldown = await this.redis.get(cooldownKey);
    if (isCooldown) {
      const ttl = await this.redis.ttl(cooldownKey);
      throw new Error(
        `Vui lòng đợi ${ttl > 0 ? ttl : 60} giây trước khi yêu cầu mã OTP mới.`,
      );
    }

    // 3. Kiểm tra Giới hạn tối đa 5 lần / ngày (24h = 86400 giây)
    const dailyLimitKey = `otp:daily_count:${cleanEmail}`;
    const dailyCountStr = await this.redis.get(dailyLimitKey);
    const dailyCount = dailyCountStr ? parseInt(dailyCountStr, 10) : 0;

    if (dailyCount >= this.MAX_DAILY_OTP) {
      throw new Error(
        `Bạn đã vượt quá giới hạn ${this.MAX_DAILY_OTP} lần gửi mã OTP trong ngày. Vui lòng thử lại sau 24 giờ.`,
      );
    }

    // 4. Sinh mã OTP ngẫu nhiên 6 chữ số (ví dụ: 123456)
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // 5. Lưu mã OTP vào Redis (Key: otp:register:<email>, TTL: 5 phút)
    const otpKey = `otp:register:${cleanEmail}`;
    await this.redis.set(otpKey, otpCode, "EX", this.OTP_TTL_SECONDS);

    // 6. Đặt Cooldown 60s vào Redis
    await this.redis.set(cooldownKey, "1", "EX", this.COOLDOWN_SECONDS);

    // 7. Tăng số đếm gửi OTP trong ngày và đặt TTL 24h cho lần đếm đầu tiên
    const newDailyCount = await this.redis.incr(dailyLimitKey);
    if (newDailyCount === 1) {
      await this.redis.expire(dailyLimitKey, 86400); // 24 giờ
    }

    // 8. Gửi mail chứa OTP cho người dùng
    await this.emailService.sendOtpEmail(cleanEmail, otpCode);
  }
}
