import { Role } from "../../../domain/entities/Role";
import { IRoleRepository } from "../../../domain/repositories/IRoleRepository";
import {
  CreateRoleDto,
  CreateRoleResponseDto,
} from "../../dtos/role/CreateRoleDto";

export class CreateRoleUseCase {
  constructor(private readonly roleRepository: IRoleRepository) {}
  async execute(dto: CreateRoleDto): Promise<CreateRoleResponseDto> {
    const existing = await this.roleRepository.findByName(dto.name);
    if (existing) {
      throw new Error("Tên vai trò đã tồn tại trong hệ thống");
    }
    const role = Role.create({
      name: dto.name,
      description: dto.description,
      code: dto.code,
    });
    const saveRole = await this.roleRepository.save(role);
    return {
      id: saveRole.id,
      name: saveRole.name,
      description: saveRole.description ?? undefined,
      createdAt: saveRole.createdAt.toISOString(),
    };
  }
}
