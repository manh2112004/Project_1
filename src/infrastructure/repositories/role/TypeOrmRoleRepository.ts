import { Repository, In } from "typeorm";
import { Role } from "../../../domain/entities/Role";
import { IRoleRepository } from "../../../domain/repositories/IRoleRepository";
import { RoleOrmEntity } from "../../database/entities/RoleOrmEntity";
import { PermissionOrmEntity } from "../../database/entities/PermissionOrmEntity";
export class TypeOrmRoleRepository implements IRoleRepository {
  constructor(private readonly ormRepository: Repository<RoleOrmEntity>) {}
  async save(role: Role): Promise<Role> {
    const ormEntity = this.toOrm(role);
    if (role.permissionCodes.length > 0) {
      const permissions = await this.ormRepository.manager
        .getRepository(PermissionOrmEntity)
        .find({ where: { name: In(role.permissionCodes) } });
      if (permissions.length !== role.permissionCodes.length) {
        throw new Error(
          "Một hoặc nhiều mã quyền hạn không tồn tại trong hệ thống.",
        );
      }
      ormEntity.permissions = permissions;
    } else {
      ormEntity.permissions = [];
    }
    const saveOrm = await this.ormRepository.save(ormEntity);
    return this.toDomain(saveOrm);
  }
  async findById(id: string): Promise<Role | null> {
    const found = await this.ormRepository.findOne({
      where: { id },
      relations: { permissions: true },
    });
    return found ? this.toDomain(found) : null;
  }
  async findAll(): Promise<Role[]> {
    const found = await this.ormRepository.find({
      relations: { permissions: true },
    });
    return found.map((orm) => this.toDomain(orm));
  }
  async findByName(name: string): Promise<Role | null> {
    const found = await this.ormRepository.findOne({
      where: { name },
      relations: { permissions: true },
    });
    return found ? this.toDomain(found) : null;
  }
  async findByCode(code: string): Promise<Role | null> {
    const found = await this.ormRepository.findOne({
      where: { code },
      relations: { permissions: true },
    });
    return found ? this.toDomain(found) : null;
  }
  async findAndCount(
    page: number,
    limit: number,
    search?: string,
  ): Promise<{ roles: Role[]; totalCount: number }> {
    const queryBuilder = this.ormRepository.createQueryBuilder("role");
    queryBuilder.leftJoinAndSelect("role.permissions", "permission");
    if (search) {
      queryBuilder.where("(unaccent(role.name) ILIKE unaccent(:search))", {
        search: `%${search}%`,
      });
    }
    const [found, totalCount] = await queryBuilder
      .orderBy("role.createdAt", "DESC")
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
    return {
      roles: found.map((orm) => this.toDomain(orm)),
      totalCount,
    };
  }
  private toDomain(orm: RoleOrmEntity): Role {
    return new Role({
      id: orm.id,
      name: orm.name,
      description: orm.description,
      code: orm.code,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
      deletedAt: orm.deletedAt,
      permissionCodes: orm.permissions
        ? orm.permissions.map((p) => p.name)
        : [],
    });
  }

  private toOrm(domain: Role): RoleOrmEntity {
    const orm = new RoleOrmEntity();
    orm.id = domain.id;
    orm.name = domain.name;
    orm.description = domain.description;
    orm.code = domain.code;
    orm.createdAt = domain.createdAt;
    orm.updatedAt = domain.updatedAt;
    orm.deletedAt = domain.deletedAt;
    return orm;
  }
}
