import { User } from "../../../domain/entities/User";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IRoleRepository } from "../../../domain/repositories/IRoleRepository";
import { IPasswordService } from "../../services/IPasswordService";
import { RegisterDto } from "../../dtos/auth/RegisterDto";

export class RegisterUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly roleRepository: IRoleRepository,
    private readonly passwordService: IPasswordService
  ) {}

  async execute(dto: RegisterDto): Promise<User> {
    // 1. Kiểm tra Email trùng lặp
    const existingEmail = await this.userRepository.findByEmail(dto.email);
    if (existingEmail) {
      throw new Error("Email đã được sử dụng bởi một tài khoản khác.");
    }

    // 2. Kiểm tra Số điện thoại trùng lặp (nếu có truyền lên)
    if (dto.phoneNumber) {
      const existingPhone = await this.userRepository.findByPhoneNumber(dto.phoneNumber);
      if (existingPhone) {
        throw new Error("Số điện thoại đã được sử dụng bởi một tài khoản khác.");
      }
    }

    // 3. Tìm vai trò CUSTOMER mặc định trong hệ thống
    const customerRole = await this.roleRepository.findByCode("CUSTOMER");
    if (!customerRole) {
      throw new Error("Vai trò khách hàng mặc định (CUSTOMER) không tồn tại trên hệ thống.");
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

    // 6. Lưu vào cơ sở dữ liệu
    return this.userRepository.save(user);
  }
}
