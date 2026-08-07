import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IRoleRepository } from "../../../domain/repositories/IRoleRepository";
import { IJwtService } from "../../services/IJwtService";

export class RefreshTokenUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly roleRepository: IRoleRepository,
    private readonly jwtService: IJwtService
  ) {}

  async execute(refreshTokenInput: string): Promise<{ accessToken: string; refreshToken: string }> {
    if (!refreshTokenInput) {
      throw new Error("Mã Refresh Token không được để trống.");
    }

    // 1. Kiểm tra chữ ký & hạn dùng của Refresh Token
    let decoded: any;
    try {
      decoded = this.jwtService.verifyToken(refreshTokenInput);
    } catch (error) {
      throw new Error("Mã Refresh Token không hợp lệ hoặc đã hết hạn.");
    }

    // 2. Tìm kiếm User theo ID giải mã từ Token
    const user = await this.userRepository.findById(decoded.id);
    if (!user) {
      throw new Error("Tài khoản không tồn tại trên hệ thống.");
    }

    // 3. Kiểm tra trạng thái hoạt động
    if (user.status === "BLOCKED") {
      throw new Error("Tài khoản của bạn đã bị khóa.");
    }

    // 4. So khớp Refresh Token gửi lên với Refresh Token đang lưu trong DB
    if (user.refreshToken !== refreshTokenInput) {
      throw new Error("Mã Refresh Token đã bị hủy hoặc được sử dụng trên thiết bị khác.");
    }

    // 5. Lấy vai trò và quyền hạn hiện tại
    const role = await this.roleRepository.findById(user.roleId);

    // 6. Sinh cặp Token mới
    const newAccessToken = this.jwtService.generateToken(
      {
        id: user.id,
        email: user.email,
        roleCode: role?.code || "",
        permissions: role?.permissionCodes || [],
      },
      "15m"
    );

    const newRefreshToken = this.jwtService.generateToken(
      {
        id: user.id,
      },
      "7d"
    );

    // 7. Cập nhật Refresh Token mới vào DB
    user.updateRefreshToken(newRefreshToken);
    await this.userRepository.save(user);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
