import { Repository, Raw, In } from "typeorm";
import { Product } from "../../../domain/entities/Product";
import { IProductRepository } from "../../../domain/repositories/IProductRepository";
import { ProductOrmEntity } from "../../database/entities/ProductOrmEntity";

export class TypeOrmProductRepository implements IProductRepository {
  constructor(private readonly ormRepository: Repository<ProductOrmEntity>) { }

  async findByIds(ids: string[]): Promise<Product[]> {
    if (!ids || ids.length === 0) return [];
    const found = await this.ormRepository.find({
      where: { id: In(ids) },
      relations: { store: true },
    });
    return found.map((orm) => this.toDomain(orm));
  }

  async findAndCount(
    page: number,
    limit: number,
    search?: string,
  ): Promise<{ products: Product[]; totalCount: number }> {
    const queryBuilder = this.ormRepository.createQueryBuilder("product")
      .leftJoinAndSelect("product.store", "store");

    if (search && search.trim().length > 0) {
      queryBuilder.where(
        "(unaccent(product.name) ILIKE unaccent(:search) OR unaccent(product.sku) ILIKE unaccent(:search) OR unaccent(product.slug) ILIKE unaccent(:search))",
        { search: `%${search}%` },
      );
    }

    const [found, totalCount] = await queryBuilder
      .orderBy("product.createdAt", "DESC")
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      products: found.map((orm) => this.toDomain(orm)),
      totalCount,
    };
  }

  async save(product: Product): Promise<Product> {
    const ormEntity = this.toOrm(product);
    const savedOrm = await this.ormRepository.save(ormEntity);
    return this.findById(savedOrm.id) as Promise<Product>;
  }

  async findById(id: string): Promise<Product | null> {
    const found = await this.ormRepository.findOne({
      where: { id },
      relations: { store: true, category: true, brand: true },
    });
    return found ? this.toDomain(found) : null;
  }

  async findBySku(sku: string): Promise<Product | null> {
    const found = await this.ormRepository.findOne({
      where: { sku },
      relations: { store: true },
    });
    return found ? this.toDomain(found) : null;
  }

  async findBySlug(slug: string): Promise<Product | null> {
    const found = await this.ormRepository.findOne({
      where: { slug },
      relations: { store: true, category: true, brand: true },
    });
    return found ? this.toDomain(found) : null;
  }

  async delete(id: string): Promise<void> {
    await this.ormRepository.softDelete(id);
  }

  async findAll(): Promise<Product[]> {
    const found = await this.ormRepository.find({ relations: { store: true } });
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
        relations: { store: true },
      });
      return found.map((orm) => this.toDomain(orm));
    }
    const found = await this.ormRepository.find({ relations: { store: true } });
    return found.map((orm) => this.toDomain(orm));
  }

  async findByCategoryId(categoryId: string): Promise<Product[]> {
    const found = await this.ormRepository.find({
      where: { categoryId },
      relations: { store: true },
    });
    return found.map((orm) => this.toDomain(orm));
  }

  async findByStoreId(storeId: string): Promise<Product[]> {
    const found = await this.ormRepository.find({
      where: { storeId },
      order: { createdAt: "DESC" },
      relations: { store: true },
    });
    return found.map((orm) => this.toDomain(orm));
  }

  private toDomain(orm: ProductOrmEntity): Product {
    const storeInfo = orm.store
      ? {
        id: orm.store.id,
        name: orm.store.name,
        logo: orm.store.logo,
        contactPhone: orm.store.contactPhone,
        contactEmail: orm.store.contactEmail,
        status: orm.store.status,
        isOnVacation: orm.store.isOnVacation,
      }
      : undefined;

    return new Product({
      id: orm.id,
      storeId: orm.storeId,
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
      store: storeInfo,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
      deletedAt: orm.deletedAt,
    });
  }

  private toOrm(domain: Product): ProductOrmEntity {
    const orm = new ProductOrmEntity();
    orm.id = domain.id;
    orm.storeId = domain.storeId;
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
