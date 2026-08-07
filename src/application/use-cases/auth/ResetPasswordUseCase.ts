import { Redis } from "ioredis";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IPasswordService } from "../../services/IPasswordService";

export interface ResetPasswordInput {
  resetToken: string;
  newPassword: string;
}

export class ResetPasswordUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordService: IPasswordService,
    private readonly redis: Redis,
  ) {}

  async execute(input: ResetPasswordInput): Promise<void> {
    if (!input.resetToken || input.resetToken.trim().length === 0) {
      throw new Error("Vui lòng cung cấp mã Reset Token xác thực.");
    }

    if (!input.newPassword || input.newPassword.trim().length < 6) {
      throw new Error("Mật khẩu mới phải có ít nhất 6 ký tự.");
    }

    // 1. Đọc email từ Redis bằng resetToken (Đã cấp ở bước Xác thực OTP)
    const tokenKey = `reset_token:${input.resetToken.trim()}`;
    const userEmail = await this.redis.get(tokenKey);
    if (!userEmail) {
      throw new Error("Phiên làm việc đã hết hạn hoặc Mã Reset Token không hợp lệ. Vui lòng thực hiện lại từ đầu.");
    }

    // 2. Tìm thông tin tài khoản người dùng trong CSDL
    const user = await this.userRepository.findByEmail(userEmail);
    if (!user) {
      throw new Error("Không tìm thấy thông tin tài khoản.");
    }

    // 3. Mã hóa mật khẩu mới & cập nhật User Aggregate Root
    const newPasswordHash = await this.passwordService.hash(input.newPassword);
    user.changePassword(newPasswordHash);
    user.updateRefreshToken(null); // Thu hồi Refresh Token cũ vì lý do bảo mật

    // 4. Lưu vào CSDL & Xóa mã Reset Token trên Redis (Token chỉ dùng 1 lần)
    await this.userRepository.save(user);
    await this.redis.del(tokenKey);
  }
}
