import { IPermissionRepository } from "../../../domain/repositories/IPermissionRepository";
import { PermissionResponseDto } from "../../dtos/permission/PermissionDto";

export class GetAllPermissionUseCase {
  constructor(private readonly permissionRepository: IPermissionRepository) {}

  async execute(): Promise<PermissionResponseDto[]> {
    const permissions = await this.permissionRepository.findAll();
    return permissions.map((permission) => ({
      id: permission.id,
      name: permission.name,
      module: permission.module,
      description: permission.description ?? undefined,
      createdAt: permission.createdAt.toISOString(),
    }));
  }
}
