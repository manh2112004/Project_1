import { SystemRole } from "../../../domain/constant/SystemRole ";
import { IRoleRepository } from "../../../domain/repositories/IRoleRepository";
import {
  RolePermissionsDto,
  RolePermissionsResponseDto,
} from "../../dtos/role/RolePermissionsDto";

export class RevokePermissionFromRoleUseCase {
  constructor(private readonly roleRepository: IRoleRepository) {}

  async execute(dto: RolePermissionsDto): Promise<RolePermissionsResponseDto> {
    const role = await this.roleRepository.findById(dto.roleId);
    if (!role) {
      throw new Error("Vai trò không tồn tại trong hệ thống.");
    }
    if (role.code === SystemRole.SUPER_ADMIN) {
      throw new Error("Không thể thu hồi quyền hạn của vai trò hệ thống.");
    }
    for (const code of dto.permissionCodes) {
      role.revokePermission(code);
    }

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
