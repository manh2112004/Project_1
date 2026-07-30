import { IPermissionRepository } from "../../../domain/repositories/IPermissionRepository";
import { PaginatedPermissionsResponse } from "../../dtos/permission/PermissionDto";

export class GetPermissionPaginationUseCase {
  constructor(private readonly permissionRepository: IPermissionRepository) {}

  async execute(
    page?: number,
    limit?: number,
    search?: string,
  ): Promise<PaginatedPermissionsResponse> {
    const validPage = page && page > 0 ? page : 1;
    const validLimit = limit && limit > 0 ? limit : 10;

    const { permissions, totalCount } = await this.permissionRepository.findAndCount(
      validPage,
      validLimit,
      search,
    );

    const totalPages = Math.ceil(totalCount / validLimit);

    return {
      permissions: permissions.map((permission) => ({
        id: permission.id,
        name: permission.name,
        module: permission.module,
        description: permission.description ?? undefined,
        createdAt: permission.createdAt.toISOString(),
      })),
      meta: {
        totalCount,
        totalPages,
        currentPage: validPage,
        limit: validLimit,
      },
    };
  }
}
