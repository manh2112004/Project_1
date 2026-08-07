import { Redis } from "ioredis";
import { User } from "../../../domain/entities/User";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IRoleRepository } from "../../../domain/repositories/IRoleRepository";
import { IPasswordService } from "../../services/IPasswordService";
import { RegisterDto } from "../../dtos/auth/RegisterDto";

export class RegisterUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly roleRepository: IRoleRepository,
    private readonly passwordService: IPasswordService,
    private readonly redis?: Redis,
  ) {}

  async execute(dto: RegisterDto): Promise<User> {
    // 0. Kiểm tra dữ liệu bắt buộc (Validation)
    if (!dto.password || dto.password.trim() === "") {
      throw new Error("Mật khẩu không được để trống.");
    }
    if (dto.password.length < 6) {
      throw new Error("Mật khẩu phải chứa ít nhất 6 ký tự.");
    }

    // 0.1 Kiểm tra OTP từ Redis nếu hệ thống yêu cầu OTP
    if (this.redis) {
      if (!dto.otp || !dto.otp.trim()) {
        throw new Error("Vui lòng nhập mã OTP xác thực được gửi đến Email.");
      }

      const redisKey = `otp:register:${dto.email.toLowerCase().trim()}`;
      const storedOtp = await this.redis.get(redisKey);

      if (!storedOtp) {
        throw new Error(
          "Mã OTP đã hết hạn hoặc không tồn tại. Vui lòng chọn Gửi lại mã.",
        );
      }

      if (storedOtp !== dto.otp.trim()) {
        throw new Error("Mã OTP không chính xác. Vui lòng kiểm tra lại.");
      }

      // Xóa mã OTP ngay sau khi đã xác thực thành công
      await this.redis.del(redisKey);
    }

    // 1. Kiểm tra Email trùng lặp
    const existingEmail = await this.userRepository.findByEmail(dto.email);
    if (existingEmail) {
      throw new Error("Email đã được sử dụng bởi một tài khoản khác.");
    }

    // 2. Kiểm tra Số điện thoại trùng lặp (nếu có truyền lên)
    if (dto.phoneNumber) {
      const existingPhone = await this.userRepository.findByPhoneNumber(
        dto.phoneNumber,
      );
      if (existingPhone) {
        throw new Error(
          "Số điện thoại đã được sử dụng bởi một tài khoản khác.",
        );
      }
    }

    // 3. Tìm vai trò CUSTOMER mặc định trong hệ thống
    const customerRole = await this.roleRepository.findByCode("CUSTOMER");
    if (!customerRole) {
      throw new Error(
        "Vai trò khách hàng mặc định (CUSTOMER) không tồn tại trên hệ thống.",
      );
    }

    // 4. Mã hóa mật khẩu
    const passwordHash = await this.passwordService.hash(dto.password);

    // 5. Khởi tạo đối tượng User
    const user = User.create({
      roleId: customerRole.id,
      email: dto.email,
      passwordHash,
      fullName: dto.fullName,
      phoneNumber: dto.phoneNumber,
      gender: dto.gender,
    });

    if (this.redis) {
      user.verifyEmail();
    }

    // 6. Lưu vào cơ sở dữ liệu
    return this.userRepository.save(user);
  }
}
