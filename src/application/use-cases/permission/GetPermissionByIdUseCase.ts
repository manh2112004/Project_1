import { IPermissionRepository } from "../../../domain/repositories/IPermissionRepository";
import { PermissionResponseDto } from "../../dtos/permission/PermissionDto";

export class GetPermissionByIdUseCase {
  constructor(private readonly permissionRepository: IPermissionRepository) {}

  async execute(id: string): Promise<PermissionResponseDto> {
    const permission = await this.permissionRepository.findById(id);
    if (!permission) {
      throw new Error("Quyền hạn không tồn tại trong hệ thống.");
    }

    return {
      id: permission.id,
      name: permission.name,
      module: permission.module,
      description: permission.description ?? undefined,
      createdAt: permission.createdAt.toISOString(),
    };
  }
}
