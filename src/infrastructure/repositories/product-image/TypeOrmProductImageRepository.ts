import { Repository } from "typeorm";
import { ProductImage } from "../../../domain/entities/ProductImage";
import { IProductImageRepository } from "../../../domain/repositories/IProductImageRepository";
import { ProductImageOrmEntity } from "../../database/entities/ProductImageOrmEntity";

export class TypeOrmProductImageRepository implements IProductImageRepository {
    constructor(private readonly ormRepository: Repository<ProductImageOrmEntity>) { }

    async save(productImage: ProductImage): Promise<ProductImage> {
        const ormEntity = this.toOrm(productImage);
        const savedOrm = await this.ormRepository.save(ormEntity);
        return this.toDomain(savedOrm);
    }

    async findById(id: string): Promise<ProductImage | null> {
        const found = await this.ormRepository.findOne({ where: { id } });
        return found ? this.toDomain(found) : null;
    }

    async findByProductId(productId: string): Promise<ProductImage[]> {
        const found = await this.ormRepository.find({
            where: { productId },
            order: { sortOrder: "ASC" } // Sắp xếp ảnh theo số thứ tự hiển thị tăng dần
        });
        return found.map(orm => this.toDomain(orm));
    }

    async delete(id: string): Promise<void> {
        await this.ormRepository.delete(id);
    }

    private toDomain(orm: ProductImageOrmEntity): ProductImage {
        return new ProductImage({
            id: orm.id,
            productId: orm.productId,
            imageUrl: orm.imageUrl,
            isThumbnail: orm.isThumbnail,
            sortOrder: orm.sortOrder,
            createdAt: orm.createdAt
        });
    }

    private toOrm(domain: ProductImage): ProductImageOrmEntity {
        const orm = new ProductImageOrmEntity();
        orm.id = domain.id;
        orm.productId = domain.productId;
        orm.imageUrl = domain.imageUrl;
        orm.isThumbnail = domain.isThumbnail;
        orm.sortOrder = domain.sortOrder;
        orm.createdAt = domain.createdAt;
        return orm;
    }
}
