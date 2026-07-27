import { Repository } from "typeorm";
import { Product } from "../../../domain/entities/Product";
import { IProductRepository } from "../../../domain/repositories/IProductRepository";
import { ProductOrmEntity } from "../../database/entities/ProductOrmEntity";
import { Raw } from "typeorm";
export class TypeOrmProductRepository implements IProductRepository {
  constructor(private readonly ormRepository: Repository<ProductOrmEntity>) {}
  async findAndCount(
    page: number,
    limit: number,
  ): Promise<{ products: Product[]; totalCount: number }> {
    const [found, totalCount] = await this.ormRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: "DESC" },
    });
    return {
      products: found.map((orm) => this.toDomain(orm)),
      totalCount,
    };
  }

  async save(product: Product): Promise<Product> {
    const ormEntity = this.toOrm(product);
    const savedOrm = await this.ormRepository.save(ormEntity);
    return this.toDomain(savedOrm);
  }

  async findById(id: string): Promise<Product | null> {
    const found = await this.ormRepository.findOne({ where: { id } });
    return found ? this.toDomain(found) : null;
  }

  async findBySku(sku: string): Promise<Product | null> {
    const found = await this.ormRepository.findOne({ where: { sku } });
    return found ? this.toDomain(found) : null;
  }

  async findBySlug(slug: string): Promise<Product | null> {
    const found = await this.ormRepository.findOne({ where: { slug } });
    return found ? this.toDomain(found) : null;
  }

  async delete(id: string): Promise<void> {
    await this.ormRepository.softDelete(id);
  }

  async findAll(): Promise<Product[]> {
    const found = await this.ormRepository.find();
    return found.map((orm) => this.toDomain(orm));
  }
  async searchByNameOrSlug(search?: string): Promise<Product[]> {
    if (search) {
      const found = await this.ormRepository.find({
        where: [
          {
            name: Raw((alias) => `unaccent(${alias}) ILIKE unaccent(:search)`, {
              search: `%${search}%`,
            }),
          },
          {
            sku: Raw((alias) => `unaccent(${alias}) ILIKE unaccent(:search)`, {
              search: `%${search}%`,
            }),
          },
        ],
      });
      return found.map((orm) => this.toDomain(orm));
    }
    const found = await this.ormRepository.find();
    return found.map((orm) => this.toDomain(orm));
  }
  async findByCategoryId(categoryId: string): Promise<Product[]> {
    const found = await this.ormRepository.find({ where: { categoryId } });
    return found.map((orm) => this.toDomain(orm));
  }

  private toDomain(orm: ProductOrmEntity): Product {
    return new Product({
      id: orm.id,
      categoryId: orm.categoryId,
      brandId: orm.brandId,
      name: orm.name,
      slug: orm.slug,
      sku: orm.sku,
      shortDescription: orm.shortDescription,
      description: orm.description,
      thumbnail: orm.thumbnail,
      price: orm.price,
      discountPrice: orm.discountPrice,
      status: orm.status,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
      deletedAt: orm.deletedAt,
    });
  }

  private toOrm(domain: Product): ProductOrmEntity {
    const orm = new ProductOrmEntity();
    orm.id = domain.id;
    orm.categoryId = domain.categoryId;
    orm.brandId = domain.brandId;
    orm.name = domain.name;
    orm.slug = domain.slug;
    orm.sku = domain.sku;
    orm.shortDescription = domain.shortDescription;
    orm.description = domain.description;
    orm.thumbnail = domain.thumbnail;
    orm.price = domain.price;
    orm.discountPrice = domain.discountPrice;
    orm.status = domain.status;
    orm.createdAt = domain.createdAt;
    orm.updatedAt = domain.updatedAt;
    orm.deletedAt = domain.deletedAt;
    return orm;
  }
}
