import { IRoleRepository } from "../../../domain/repositories/IRoleRepository";
import { RolePermissionsDto, RolePermissionsResponseDto } from "../../dtos/role/RolePermissionsDto";

export class AssignPermissionToRoleUseCase {
  constructor(private readonly roleRepository: IRoleRepository) {}

  async execute(dto: RolePermissionsDto): Promise<RolePermissionsResponseDto> {
    const role = await this.roleRepository.findById(dto.roleId);
    if (!role) {
      throw new Error("Vai trò không tồn tại trong hệ thống.");
    }

    // Gán từng quyền vào thực thể
    for (const code of dto.permissionCodes) {
      role.assignPermission(code);
    }

    // Lưu lại. Nếu có mã quyền không tồn tại, repository sẽ ném lỗi.
    const saved = await this.roleRepository.save(role);

    return {
      id: saved.id,
      name: saved.name,
      description: saved.description ?? undefined,
      permissionCodes: saved.permissionCodes,
      updatedAt: saved.updatedAt.toISOString(),
    };
  }
}
