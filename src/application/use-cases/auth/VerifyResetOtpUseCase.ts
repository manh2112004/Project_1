import { Redis } from "ioredis";
import { randomUUID } from "crypto";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";

export interface VerifyResetOtpInput {
  email: string;
  otpCode: string;
}

export interface VerifyResetOtpOutput {
  resetToken: string;
}

export class VerifyResetOtpUseCase {
  private readonly TOKEN_TTL_SECONDS = 600; // Token có hiệu lực 10 phút

  constructor(
    private readonly userRepository: IUserRepository,
    private readonly redis: Redis,
  ) {}

  async execute(input: VerifyResetOtpInput): Promise<VerifyResetOtpOutput> {
    const cleanEmail = input.email ? input.email.toLowerCase().trim() : "";
    if (!cleanEmail) {
      throw new Error("Email không được để trống.");
    }

    if (!input.otpCode || input.otpCode.trim().length === 0) {
      throw new Error("Vui lòng nhập mã xác thực OTP.");
    }

    // 1. Kiểm tra tài khoản trong CSDL
    const user = await this.userRepository.findByEmail(cleanEmail);
    if (!user) {
      throw new Error("Không tìm thấy thông tin tài khoản.");
    }

    // 2. Đọc mã OTP từ Redis
    const otpKey = `otp:forgot_pass:${cleanEmail}`;
    const storedOtp = await this.redis.get(otpKey);
    if (!storedOtp) {
      throw new Error("Mã OTP đã hết hạn hoặc không tồn tại. Vui lòng yêu cầu mã mới.");
    }

    // 3. So sánh mã OTP
    if (storedOtp.trim() !== input.otpCode.trim()) {
      throw new Error("Mã xác thực OTP không chính xác.");
    }

    // 4. Sinh Reset Token 1 lần (UUID) và lưu vào Redis
    const resetToken = randomUUID();
    const tokenKey = `reset_token:${resetToken}`;
    await this.redis.set(tokenKey, cleanEmail, "EX", this.TOKEN_TTL_SECONDS);

    // 5. Xóa mã OTP sau khi đã xác thực thành công
    await this.redis.del(otpKey);

    return { resetToken };
  }
}
