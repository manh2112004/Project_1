import { User } from "../../../domain/entities/User";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IRoleRepository } from "../../../domain/repositories/IRoleRepository";
import { IPasswordService } from "../../services/IPasswordService";
import { CreateUserByAdminDto } from "../../dtos/user/CreateUserByAdminDto";

export class CreateUserByAdminUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly roleRepository: IRoleRepository,
    private readonly passwordService: IPasswordService
  ) {}

  async execute(dto: CreateUserByAdminDto): Promise<User> {
    // 1. Kiểm tra Vai trò (Role) có tồn tại trong hệ thống không
    const existingRole = await this.roleRepository.findById(dto.roleId);
    if (!existingRole) {
      throw new Error("Vai trò (Role) chỉ định không tồn tại trên hệ thống.");
    }

    // 2. Kiểm tra Email trùng lặp
    const existingEmail = await this.userRepository.findByEmail(dto.email);
    if (existingEmail) {
      throw new Error("Email đã được sử dụng bởi một tài khoản khác.");
    }

    // 3. Kiểm tra Số điện thoại trùng lặp (nếu có truyền lên)
    if (dto.phoneNumber) {
      const existingPhone = await this.userRepository.findByPhoneNumber(dto.phoneNumber);
      if (existingPhone) {
        throw new Error("Số điện thoại đã được sử dụng bởi một tài khoản khác.");
      }
    }

    // 4. Mã hóa mật khẩu
    const passwordHash = await this.passwordService.hash(dto.password);

    // 5. Khởi tạo đối tượng User với roleId được chỉ định
    const user = User.create({
      roleId: dto.roleId,
      email: dto.email,
      passwordHash,
      fullName: dto.fullName,
      phoneNumber: dto.phoneNumber,
      gender: dto.gender,
      avatarUrl: dto.avatarUrl,
    });

    // 6. Lưu vào cơ sở dữ liệu
    return this.userRepository.save(user);
  }
}
