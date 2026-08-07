import { IRoleRepository } from "../../../domain/repositories/IRoleRepository";
import { RoleResponseDto } from "../../dtos/role/CreateRoleDto";

export class GetAllRoleUseCase {
  constructor(private readonly roleRepository: IRoleRepository) {}

  async execute(): Promise<RoleResponseDto[]> {
    const roles = await this.roleRepository.findAll();
    return roles.map((role) => ({
      id: role.id,
      name: role.name,
      code: role.code,
      description: role.description ?? undefined,
      permissionCodes: role.permissionCodes,
      createdAt: role.createdAt.toISOString(),
      updatedAt: role.updatedAt.toISOString(),
    }));
  }
}
