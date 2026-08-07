import { OAuth2Client } from "google-auth-library";
import { User } from "../../../domain/entities/User";
import { Email } from "../../../domain/value-objects/Email";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IRoleRepository } from "../../../domain/repositories/IRoleRepository";
import { IPasswordService } from "../../services/IPasswordService";
import { IJwtService } from "../../services/IJwtService";
import { LoginResponse } from "../../dtos/auth/LoginDto";

export class GoogleAuthUseCase {
  private googleClient: OAuth2Client;

  constructor(
    private readonly userRepository: IUserRepository,
    private readonly roleRepository: IRoleRepository,
    private readonly passwordService: IPasswordService,
    private readonly jwtService: IJwtService,
  ) {
    const clientId = process.env.GOOGLE_CLIENT_ID || "";
    this.googleClient = new OAuth2Client(clientId);
  }

  async execute(idToken: string): Promise<LoginResponse> {
    if (!idToken) {
      throw new Error("Mã Google ID Token không được để trống.");
    }

    let payload: any = null;

    try {
      // 1. Xác thực Google ID Token với Google Servers
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID
          ? process.env.GOOGLE_CLIENT_ID
          : undefined, // kiểm tra idToken có phải được lấy từ nút đăng nhập gg của trang hiện tại ko
      });
      payload = ticket.getPayload();
      if (!payload) {
        throw new Error("Không thể trích xuất thông tin từ token Google");
      }
    } catch (err) {
      throw new Error("Xác thực tài khoản Google không thành công");
    }

    if (!payload || !payload.email) {
      throw new Error("Mã xác thực Google không hợp lệ hoặc đã hết hạn.");
    }

    if (payload.email_verified === false) {
      throw new Error("Tài khoản Google của bạn chưa được xác minh email.");
    }

    const { email, name, picture, sub } = payload;
    if (!sub) {
      throw new Error("Không thể lấy mã định danh Google Sub ID.");
    }

    const emailVo = Email.create(email);
    const cleanEmail = emailVo.value;

    // 2. Tìm kiếm User theo Google Social Account trong CSDL
    let user = await this.userRepository.findBySocialAccount("GOOGLE", sub);

    if (user) {
      // Kiểm tra xem tài khoản có bị khóa không
      if (user.status === "BLOCKED") {
        throw new Error(
          "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.",
        );
      }
    } else {
      // 3. Nếu chưa thấy qua Social Account, kiểm tra xem Email đã tồn tại chưa
      user = await this.userRepository.findByEmail(cleanEmail);

      if (user) {
        if (user.status === "BLOCKED") {
          throw new Error(
            "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.",
          );
        }
        // Thêm thông tin Google Social Account vào tài khoản có sẵn
        user.addSocialAccount("GOOGLE", sub, cleanEmail);
        user.verifyEmail();
        user = await this.userRepository.save(user);
      } else {
        // Tự động đăng ký tài khoản mới với Vai trò CUSTOMER (passwordHash = null)
        const customerRole = await this.roleRepository.findByCode("CUSTOMER");
        if (!customerRole) {
          throw new Error(
            "Vai trò khách hàng (CUSTOMER) không tồn tại trên hệ thống.",
          );
        }

        user = User.create({
          roleId: customerRole.id,
          email: cleanEmail,
          passwordHash: null,
          fullName: name || "Người dùng ẩn danh",
          avatarUrl: picture,
          gender: "OTHER",
        });

        user.addSocialAccount("GOOGLE", sub, cleanEmail);
        user.verifyEmail(); // Đánh dấu Email đã được xác minh bởi Google
        user = await this.userRepository.save(user);
      }
    }

    // 4. Lấy thông tin Role và Permissions
    const role = await this.roleRepository.findById(user.roleId);
    if (!role) {
      throw new Error("Không tìm thấy vai trò của người dùng.");
    }

    const permissions = role.permissionCodes || [];

    // 5. Tạo Access Token (15m) và Refresh Token (7d)
    const accessToken = this.jwtService.generateToken(
      {
        id: user.id,
        email: user.email,
        roleCode: role.code,
        permissions,
      },
      "15m",
    );

    const refreshToken = this.jwtService.generateToken(
      {
        id: user.id,
      },
      "7d",
    );

    // 6. Cập nhật thông tin phiên đăng nhập
    user.updateLastLogin();
    user.updateRefreshToken(refreshToken);
    await this.userRepository.save(user);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
        roleCode: role.code || "",
        permissions,
      },
    };
  }
}
