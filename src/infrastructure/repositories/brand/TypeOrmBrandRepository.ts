import { Repository } from 'typeorm';
import { IBrandRepository } from '../../../domain/repositories/IBrandRepository';;
import { BrandOrmEntity } from '../../database/entities/BrandOrmEntity';
import { Brand } from '../../../domain/entities/Brand';
export class TypeOrmBrandRepository implements IBrandRepository {
    constructor(private readonly ormRepository: Repository<BrandOrmEntity>) { }
    async save(brand: Brand): Promise<Brand> {
        const ormEntity = this.toOrm(brand);
        const saveOrm = await this.ormRepository.save(ormEntity);
        return this.toDomain(saveOrm);
    }
    async findById(id: string): Promise<Brand | null> {
        const found = await this.ormRepository.findOne({ where: { id } })
        return found ? this.toDomain(found) : null
    }
    async findByName(name: string): Promise<Brand | null> {
        const found = await this.ormRepository.findOne({ where: { name } })
        return found ? this.toDomain(found) : null
    }
    async delete(id: string): Promise<void> {
        await this.ormRepository.softDelete(id);
    }
    async findAll(): Promise<Brand[]> {
        const found = await this.ormRepository.find({ where: { isActive: true } })
        return found.map((orm) => this.toDomain(orm));
    }
    private toDomain(orm: BrandOrmEntity): Brand {
        return new Brand({
            id: orm.id,
            name: orm.name,
            logo: orm.logo,
            description: orm.description,
            isActive: orm.isActive,
            createdAt: orm.createdAt,
            updatedAt: orm.updatedAt,
            deletedAt: orm.deletedAt
        });
    }
    private toOrm(domain: Brand): BrandOrmEntity {
        const orm = new BrandOrmEntity;
        orm.id = domain.id;
        orm.name = domain.name;
        orm.logo = domain.logo;
        orm.description = domain.description;
        orm.isActive = domain.isActive;
        orm.createdAt = domain.createdAt;
        orm.updatedAt = domain.updatedAt;
        orm.deletedAt = domain.deletedAt;
        return orm;
    }
}