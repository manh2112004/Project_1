import { Redis } from "ioredis";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { Email } from "../../../domain/value-objects/Email";
import { IPasswordService } from "../../services/IPasswordService";
import { EmailService } from "../../../infrastructure/services/EmailService";

export interface RequestChangeUserEmailInput {
  userId: string;
  newEmail: string;
  currentPassword?: string;
}

export class RequestChangeUserEmailUseCase {
  private readonly OTP_TTL_SECONDS = 300; // 5 phút
  private readonly COOLDOWN_SECONDS = 60; // 60s
  private readonly MAX_DAILY_OTP = 5;

  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordService: IPasswordService,
    private readonly redis: Redis,
    private readonly emailService: EmailService,
  ) {}

  async execute(input: RequestChangeUserEmailInput): Promise<void> {
    const user = await this.userRepository.findById(input.userId);
    if (!user) {
      throw new Error("Không tìm thấy thông tin người dùng.");
    }

    // 1. Validate email mới
    const emailVo = Email.create(input.newEmail);
    const cleanNewEmail = emailVo.value;

    if (cleanNewEmail === user.email) {
      throw new Error("Địa chỉ Email mới phải khác địa chỉ Email hiện tại của bạn.");
    }

    // 2. Kiểm tra email mới có bị trùng với tài khoản khác không
    const existingUser = await this.userRepository.findByEmail(cleanNewEmail);
    if (existingUser && existingUser.id !== user.id) {
      throw new Error("Địa chỉ Email này đã được sử dụng bởi một tài khoản khác.");
    }

    // 3. Nếu tài khoản đăng ký bằng mật khẩu, bắt buộc xác minh mật khẩu hiện tại
    if (user.passwordHash) {
      if (!input.currentPassword) {
        throw new Error("Vui lòng nhập mật khẩu hiện tại để xác nhận thay đổi Email.");
      }
      const isPasswordValid = await this.passwordService.compare(
        input.currentPassword,
        user.passwordHash,
      );
      if (!isPasswordValid) {
        throw new Error("Mật khẩu hiện tại không chính xác.");
      }
    }

    // 4. Kiểm tra Cooldown 60s trên Redis
    const cooldownKey = `otp:change_email_cooldown:${user.id}`;
    const isCooldown = await this.redis.get(cooldownKey);
    if (isCooldown) {
      const ttl = await this.redis.ttl(cooldownKey);
      throw new Error(
        `Vui lòng đợi ${ttl > 0 ? ttl : 60} giây trước khi yêu cầu mã OTP mới.`,
      );
    }

    // 5. Kiểm tra giới hạn 5 lần/ngày
    const dailyKey = `otp:change_email_daily:${user.id}`;
    const dailyCountStr = await this.redis.get(dailyKey);
    const dailyCount = dailyCountStr ? parseInt(dailyCountStr, 10) : 0;
    if (dailyCount >= this.MAX_DAILY_OTP) {
      throw new Error(
        `Bạn đã vượt quá giới hạn ${this.MAX_DAILY_OTP} lần yêu cầu gửi OTP trong ngày. Vui lòng thử lại sau 24 giờ.`,
      );
    }

    // 6. Sinh mã OTP 6 số ngẫu nhiên
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // 7. Lưu OTP & Email mới vào Redis (Key: otp:change_email:${userId}, TTL 5 phút)
    const otpKey = `otp:change_email:${user.id}`;
    const payload = JSON.stringify({ newEmail: cleanNewEmail, otpCode });
    await this.redis.set(otpKey, payload, "EX", this.OTP_TTL_SECONDS);

    // 8. Đặt Cooldown 60s & tăng đếm daily
    await this.redis.set(cooldownKey, "1", "EX", this.COOLDOWN_SECONDS);
    const newDailyCount = await this.redis.incr(dailyKey);
    if (newDailyCount === 1) {
      await this.redis.expire(dailyKey, 86400);
    }

    // 9. Gửi Email chứa OTP tới email mới
    await this.emailService.sendChangeEmailOtp(cleanNewEmail, otpCode);
  }
}
