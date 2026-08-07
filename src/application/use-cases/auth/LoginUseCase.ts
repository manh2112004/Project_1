import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IRoleRepository } from "../../../domain/repositories/IRoleRepository";
import { IPasswordService } from "../../services/IPasswordService";
import { IJwtService } from "../../services/IJwtService";
import { LoginDto, LoginResponse } from "../../dtos/auth/LoginDto";

export class LoginUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly roleRepository: IRoleRepository,
    private readonly passwordService: IPasswordService,
    private readonly jwtService: IJwtService
  ) {}

  async execute(dto: LoginDto): Promise<LoginResponse> {
    // 1. Tìm kiếm User theo Email
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new Error("Email hoặc mật khẩu không chính xác.");
    }

    // 2. Kiểm tra trạng thái hoạt động của tài khoản
    if (user.status === "BLOCKED") {
      throw new Error("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.");
    }

    // 3. So khớp mật khẩu
    if (!user.passwordHash) {
      throw new Error("Tài khoản này được đăng ký qua bên thứ 3 (Google). Vui lòng chọn 'Đăng nhập bằng Google'.");
    }

    const isPasswordValid = await this.passwordService.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error("Email hoặc mật khẩu không chính xác.");
    }

    // 4. Lấy vai trò và danh sách quyền hạn
    const role = await this.roleRepository.findById(user.roleId);
    if (!role) {
      throw new Error("Vai trò của người dùng không hợp lệ hoặc đã bị xóa.");
    }

    // 5. Tạo Access Token (15 phút) và Refresh Token (7 ngày)
    const accessToken = this.jwtService.generateToken(
      {
        id: user.id,
        email: user.email,
        roleCode: role.code,
        permissions: role.permissionCodes,
      },
      "15m"
    );

    const refreshToken = this.jwtService.generateToken(
      {
        id: user.id,
      },
      "7d"
    );

    // 6. Cập nhật thông tin phiên đăng nhập
    user.updateLastLogin();
    user.updateRefreshToken(refreshToken);
    await this.userRepository.save(user);

    // 7. Trả về kết quả
    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
        roleCode: role.code || "",
        permissions: role.permissionCodes || [],
      },
    };
  }
}
