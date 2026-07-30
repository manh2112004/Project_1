import { Repository } from "typeorm";
import { Permission } from "../../../domain/entities/Permission";
import { IPermissionRepository } from "../../../domain/repositories/IPermissionRepository";
import { PermissionOrmEntity } from "../../database/entities/PermissionOrmEntity";

export class TypeOrmPermissionRepository implements IPermissionRepository {
  constructor(private readonly ormRepository: Repository<PermissionOrmEntity>) {}

  async save(permission: Permission): Promise<Permission> {
    const ormEntity = this.toOrm(permission);
    const savedOrm = await this.ormRepository.save(ormEntity);
    return this.toDomain(savedOrm);
  }

  async findById(id: string): Promise<Permission | null> {
    const found = await this.ormRepository.findOne({ where: { id } });
    return found ? this.toDomain(found) : null;
  }

  async findByName(name: string): Promise<Permission | null> {
    const found = await this.ormRepository.findOne({ where: { name } });
    return found ? this.toDomain(found) : null;
  }

  async findByModule(module: string): Promise<Permission[]> {
    const found = await this.ormRepository.find({ where: { module } });
    return found.map((orm) => this.toDomain(orm));
  }

  async findAll(): Promise<Permission[]> {
    const found = await this.ormRepository.find();
    return found.map((orm) => this.toDomain(orm));
  }

  async findAndCount(
    page: number,
    limit: number,
    search?: string,
  ): Promise<{ permissions: Permission[]; totalCount: number }> {
    const queryBuilder = this.ormRepository.createQueryBuilder("permission");

    if (search) {
      queryBuilder.where(
        "(unaccent(permission.name) ILIKE unaccent(:search) OR unaccent(permission.module) ILIKE unaccent(:search))",
        { search: `%${search}%` },
      );
    }

    const [found, totalCount] = await queryBuilder
      .orderBy("permission.createdAt", "DESC")
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      permissions: found.map((orm) => this.toDomain(orm)),
      totalCount,
    };
  }

  private toDomain(orm: PermissionOrmEntity): Permission {
    return new Permission({
      id: orm.id,
      name: orm.name,
      module: orm.module,
      description: orm.description,
      createdAt: orm.createdAt,
    });
  }

  private toOrm(domain: Permission): PermissionOrmEntity {
    const orm = new PermissionOrmEntity();
    orm.id = domain.id;
    orm.name = domain.name;
    orm.module = domain.module;
    orm.description = domain.description;
    orm.createdAt = domain.createdAt;
    return orm;
  }
}
