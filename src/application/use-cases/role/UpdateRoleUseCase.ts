import { SystemRole } from "../../../domain/constant/SystemRole ";
import { IRoleRepository } from "../../../domain/repositories/IRoleRepository";
import {
  UpdateRoleDto,
  UpdateRoleResponseDto,
} from "../../dtos/role/UpdateRoleDto";

export class UpdateRoleUseCase {
  constructor(private readonly roleRepository: IRoleRepository) {}
  async execute(dto: UpdateRoleDto): Promise<UpdateRoleResponseDto> {
    const role = await this.roleRepository.findById(dto.id);
    if (!role) {
      throw new Error("Vai Trò không tồn tại trong hệ thống");
    }
    if (role.code === SystemRole.SUPER_ADMIN) {
      throw new Error("Không thể sửa đổi quyền hạn của vai trò hệ thống.");
    }
    const existing = await this.roleRepository.findByName(dto.name);
    if (existing && existing.id !== role.id) {
      throw new Error("Tên vai trò đã tồn tại trong hệ thống");
    }
    role.update({
      name: dto.name,
      description: dto.description,
    });
    const saveRole = await this.roleRepository.save(role);
    return {
      id: saveRole.id,
      name: saveRole.name,
      description: saveRole.description ?? undefined,
      updatedAt: saveRole.updatedAt.toISOString(),
    };
  }
}
