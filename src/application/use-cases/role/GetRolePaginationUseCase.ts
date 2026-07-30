import { IRoleRepository } from "../../../domain/repositories/IRoleRepository";
import { RoleResponseDto } from "../../dtos/role/CreateRoleDto";

export interface PaginatedRolesResponse {
  roles: RoleResponseDto[];
  meta: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

export class GetRolePaginationUseCase {
  constructor(private readonly roleRepository: IRoleRepository) {}
  async execute(
    page?: number,
    limit?: number,
    search?: string,
  ): Promise<PaginatedRolesResponse> {
    const validPage = page && page > 0 ? page : 1;
    const validLimit = limit && limit > 0 ? limit : 10;

    const { roles, totalCount } = await this.roleRepository.findAndCount(
      validPage,
      validLimit,
      search,
    );

    const totalPages = Math.ceil(totalCount / validLimit);

    return {
      roles: roles.map((role) => ({
        id: role.id,
        name: role.name,
        description: role.description ?? undefined,
        createdAt: role.createdAt.toISOString(),
        updatedAt: role.updatedAt.toISOString(),
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
