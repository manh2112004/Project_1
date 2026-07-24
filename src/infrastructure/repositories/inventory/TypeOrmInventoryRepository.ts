import { Repository } from "typeorm";
import { Inventory } from "../../../domain/entities/Inventory";
import { IInventoryRepository } from "../../../domain/repositories/IInventoryRepository";
import { InventoryOrmEntity } from "../../database/entities/InventoryOrmEntity";

export class TypeOrmInventoryRepository implements IInventoryRepository {
    constructor(private readonly ormRepository: Repository<InventoryOrmEntity>) { }

    async save(inventory: Inventory): Promise<Inventory> {
        const ormEntity = this.toOrm(inventory);
        const savedOrm = await this.ormRepository.save(ormEntity);
        return this.toDomain(savedOrm);
    }

    async findById(id: string): Promise<Inventory | null> {
        const found = await this.ormRepository.findOne({ where: { id } });
        return found ? this.toDomain(found) : null;
    }

    async findByProductId(productId: string): Promise<Inventory | null> {
        const found = await this.ormRepository.findOne({ where: { productId } });
        return found ? this.toDomain(found) : null;
    }

    async delete(id: string): Promise<void> {
        await this.ormRepository.delete(id);
    }

    async findAll(): Promise<Inventory[]> {
        const found = await this.ormRepository.find();
        return found.map(orm => this.toDomain(orm));
    }

    private toDomain(orm: InventoryOrmEntity): Inventory {
        return new Inventory({
            id: orm.id,
            productId: orm.productId,
            quantity: orm.quantity,
            importPrice: orm.importPrice,
            createdAt: orm.createdAt,
            updatedAt: orm.updatedAt
        });
    }

    private toOrm(domain: Inventory): InventoryOrmEntity {
        const orm = new InventoryOrmEntity();
        orm.id = domain.id;
        orm.productId = domain.productId;
        orm.quantity = domain.quantity;
        orm.importPrice = domain.importPrice;
        orm.createdAt = domain.createdAt;
        orm.updatedAt = domain.updatedAt;
        return orm;
    }
}
