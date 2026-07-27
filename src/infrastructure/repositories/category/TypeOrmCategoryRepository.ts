import { Repository } from "typeorm";
import { Category } from "../../../domain/entities/Category";
import { ICategoryRepository } from "../../../domain/repositories/ICategoryRepository";
import { CategoryOrmEntity } from "../../database/entities/CategoryOrmEntity";

export class TypeOrmCategoryRepository implements ICategoryRepository {
  constructor(private readonly ormRepository: Repository<CategoryOrmEntity>) {}
  async findAndCount(
    page: number,
    limit: number,
  ): Promise<{ categories: Category[]; totalCount: number }> {
    const [found, totalCount] = await this.ormRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: "DESC" },
    });
    return {
      categories: found.map((orm) => this.toDomain(orm)),
      totalCount,
    };
  }

  async save(category: Category): Promise<Category> {
    const ormEntity = this.toOrm(category);
    const savedOrm = await this.ormRepository.save(ormEntity);
    return this.toDomain(savedOrm);
  }
  async findById(id: string): Promise<Category | null> {
    const found = await this.ormRepository.findOne({ where: { id } });
    return found ? this.toDomain(found) : null;
  }

  async findBySlug(slug: string): Promise<Category | null> {
    const found = await this.ormRepository.findOne({ where: { slug } });
    return found ? this.toDomain(found) : null;
  }

  async findByName(name: string): Promise<Category | null> {
    const found = await this.ormRepository.findOne({ where: { name } });
    return found ? this.toDomain(found) : null;
  }
  async delete(id: string): Promise<void> {
    await this.ormRepository.softDelete(id);
  }
  async findAll(): Promise<Category[]> {
    const found = await this.ormRepository.find({ where: { isActive: true } });
    return found.map((orm) => this.toDomain(orm));
  }
  private toDomain(orm: CategoryOrmEntity): Category {
    return new Category({
      id: orm.id,
      parentId: orm.parentId ?? (orm.parent ? orm.parent.id : null),
      name: orm.name,
      slug: orm.slug,
      description: orm.description,
      image: orm.image,
      isActive: orm.isActive,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
      deletedAt: orm.deletedAt,
    });
  }

  private toOrm(domain: Category): CategoryOrmEntity {
    const orm = new CategoryOrmEntity();
    if (domain.id) {
      orm.id = domain.id;
    }
    //gán cột id
    orm.parentId = domain.parentId;
    //gán đối tượng quan hệ
    if (domain.parentId) {
      orm.parent = { id: domain.parentId } as CategoryOrmEntity;
    } else {
      orm.parent = null as any;
    }
    orm.name = domain.name;
    orm.slug = domain.slug;
    orm.description = domain.description;
    orm.image = domain.image;
    orm.isActive = domain.isActive;
    orm.deletedAt = domain.deletedAt;
    return orm;
  }
}
