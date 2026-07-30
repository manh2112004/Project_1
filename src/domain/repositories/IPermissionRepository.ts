import { Permission } from "../entities/Permission";

export interface IPermissionRepository {
  save(permission: Permission): Promise<Permission>;
  findById(id: string): Promise<Permission | null>;
  findByName(name: string): Promise<Permission | null>;
  findByModule(module: string): Promise<Permission[]>;
  findAll(): Promise<Permission[]>;
  findAndCount(
    page: number,
    limit: number,
    search?: string,
  ): Promise<{ permissions: Permission[]; totalCount: number }>;
}
