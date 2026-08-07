import { IRoleRepository } from "../../../domain/repositories/IRoleRepository";
import { RoleResponseDto } from "../../dtos/role/CreateRoleDto";

export class GetRoleByIdUseCase {
  constructor(private readonly roleRepository: IRoleRepository) {}

  async execute(id: string): Promise<RoleResponseDto> {
    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new Error("Vai trò không tồn tại trong hệ thống");
    }
    return {
      id: role.id,
      name: role.name,
      code: role.code,
      description: role.description ?? undefined,
      permissionCodes: role.permissionCodes,
      createdAt: role.createdAt.toISOString(),
      updatedAt: role.updatedAt.toISOString(),
    };
  }
}
