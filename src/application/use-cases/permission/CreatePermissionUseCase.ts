import { Permission } from "../../../domain/entities/Permission";
import { IPermissionRepository } from "../../../domain/repositories/IPermissionRepository";
import { IRoleRepository } from "../../../domain/repositories/IRoleRepository";
import {
  CreatePermissionDto,
  PermissionResponseDto,
} from "../../dtos/permission/PermissionDto";

export class CreatePermissionUseCase {
  constructor(
    private readonly permissionRepository: IPermissionRepository,
    private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(dto: CreatePermissionDto): Promise<PermissionResponseDto> {
    const normalizedName = dto.name.trim().toUpperCase();
    // Kiểm tra xem mã quyền đã tồn tại chưa
    const existing = await this.permissionRepository.findByName(normalizedName);
    if (existing) {
      throw new Error(
        `Mã quyền "${normalizedName}" đã tồn tại trong hệ thống.`,
      );
    }

    // Tạo thực thể Domain (tự động validate nội tại)
    const permission = Permission.create({
      name: dto.name,
      module: dto.module,
      description: dto.description,
    });

    // Lưu xuống DB
    const saved = await this.permissionRepository.save(permission);

    // 4. TỰ ĐỘNG GÁN CHO SUPER ADMIN:
    const superAdminRole = await this.roleRepository.findByName("Super Admin");
    if (superAdminRole) {
      // Gán mã quyền vừa tạo vào cho Super Admin
      superAdminRole.assignPermission(saved.name);
      // Lưu lại thông tin vai trò Super Admin (TypeOrmRoleRepository sẽ tự động lưu vào bảng role_permissions)
      await this.roleRepository.save(superAdminRole);
    }

    // Trả về DTO phản hồi
    return {
      id: saved.id,
      name: saved.name,
      module: saved.module,
      description: saved.description ?? undefined,
      createdAt: saved.createdAt.toISOString(),
    };
  }
}
