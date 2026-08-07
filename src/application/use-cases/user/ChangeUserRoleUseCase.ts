import { User } from "../../../domain/entities/User";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IRoleRepository } from "../../../domain/repositories/IRoleRepository";

export class ChangeUserRoleUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly roleRepository: IRoleRepository
  ) {}

  async execute(userId: string, newRoleId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("Không tìm thấy thông tin người dùng.");
    }

    const newRole = await this.roleRepository.findById(newRoleId);
    if (!newRole) {
      throw new Error("Vai trò (Role) mới không tồn tại trên hệ thống.");
    }

    user.changeRole(newRoleId);
    return this.userRepository.save(user);
  }
}
