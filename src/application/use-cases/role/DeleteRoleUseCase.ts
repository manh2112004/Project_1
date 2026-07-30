import { SystemRole } from "../../../domain/constant/SystemRole ";
import { IRoleRepository } from "../../../domain/repositories/IRoleRepository";

export class DeleteRoleUseCase {
  constructor(private readonly roleRepository: IRoleRepository) {}

  async execute(id: string): Promise<void> {
    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new Error("Vai trò không tồn tại trong hệ thống");
    }
    if (role.code == SystemRole.SUPER_ADMIN) {
      throw new Error("Không thể xóa vai trò hệ thống.");
    }

    role.delete();

    await this.roleRepository.save(role);
  }
}
