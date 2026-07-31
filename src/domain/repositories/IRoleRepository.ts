import { Role } from "../entities/Role";
export interface IRoleRepository {
  save(role: Role): Promise<Role>;
  findById(id: string): Promise<Role | null>;
  findAll(): Promise<Role[]>;
  findByName(name: string): Promise<Role | null>;
  findByCode(code: string): Promise<Role | null>;
  findAndCount(
    page: number,
    limit: number,
    search?: string,
  ): Promise<{ roles: Role[]; totalCount: number }>;
}
