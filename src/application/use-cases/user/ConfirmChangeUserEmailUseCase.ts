import { Redis } from "ioredis";
import { User } from "../../../domain/entities/User";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";

export interface ConfirmChangeUserEmailInput {
  userId: string;
  otpCode: string;
}

export class ConfirmChangeUserEmailUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly redis: Redis,
  ) {}

  async execute(input: ConfirmChangeUserEmailInput): Promise<User> {
    const user = await this.userRepository.findById(input.userId);
    if (!user) {
      throw new Error("Không tìm thấy thông tin người dùng.");
    }

    if (!input.otpCode || input.otpCode.trim().length === 0) {
      throw new Error("Vui lòng nhập mã xác thực OTP.");
    }

    // 1. Đọc thông tin OTP từ Redis
    const otpKey = `otp:change_email:${user.id}`;
    const rawData = await this.redis.get(otpKey);

    if (!rawData) {
      throw new Error(
        "Mã OTP đã hết hạn hoặc không tồn tại. Vui lòng gửi lại yêu cầu thay đổi Email.",
      );
    }

    let parsed: { newEmail: string; otpCode: string };
    try {
      parsed = JSON.parse(rawData);
    } catch (err) {
      throw new Error("Dữ liệu xác thực không hợp lệ.");
    }

    // 2. Kiểm tra mã OTP khớp không
    if (parsed.otpCode.trim() !== input.otpCode.trim()) {
      throw new Error("Mã xác thực OTP không chính xác.");
    }

    // 3. Thay đổi email của User & xác nhận email
    user.changeEmail(parsed.newEmail);
    user.verifyEmail();

    // 4. Lưu lại thông tin mới vào CSDL
    const updatedUser = await this.userRepository.save(user);

    // 5. Xóa Redis Key OTP sau khi hoàn tất
    await this.redis.del(otpKey);

    return updatedUser;
  }
}
