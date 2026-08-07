import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IPasswordService } from "../../services/IPasswordService";

export interface ChangeUserPasswordDto {
  userId: string;
  oldPassword: string;
  newPassword: string;
}

export class ChangeUserPasswordUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordService: IPasswordService
  ) {}

  async execute(dto: ChangeUserPasswordDto): Promise<void> {
    const user = await this.userRepository.findById(dto.userId);
    if (!user) {
      throw new Error("Không tìm thấy thông tin người dùng.");
    }

    if (!user.passwordHash) {
      throw new Error("Tài khoản này đăng ký qua bên thứ 3 (Google). Không có mật khẩu cũ để thay đổi.");
    }

    const isOldPasswordValid = await this.passwordService.compare(
      dto.oldPassword,
      user.passwordHash
    );
    if (!isOldPasswordValid) {
      throw new Error("Mật khẩu cũ không chính xác.");
    }

    if (!dto.newPassword || dto.newPassword.trim().length < 6) {
      throw new Error("Mật khẩu mới phải có ít nhất 6 ký tự.");
    }

    const newPasswordHash = await this.passwordService.hash(dto.newPassword);
    user.changePassword(newPasswordHash);

    await this.userRepository.save(user);
  }
}
