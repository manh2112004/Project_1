import { Repository } from "typeorm";
import { StoreAddress } from "../../../domain/entities/StoreAddress";
import { IStoreAddressRepository } from "../../../domain/repositories/IStoreAddressRepository";
import { StoreAddressOrmEntity } from "../../database/entities/StoreAddressOrmEntity";

export class TypeOrmStoreAddressRepository implements IStoreAddressRepository {
  constructor(
    private readonly ormRepository: Repository<StoreAddressOrmEntity>
  ) {}

  async save(storeAddress: StoreAddress): Promise<StoreAddress> {
    const orm = this.toOrm(storeAddress);
    const saved = await this.ormRepository.save(orm);
    return this.toDomain(saved);
  }

  async findById(id: string): Promise<StoreAddress | null> {
    const found = await this.ormRepository.findOne({ where: { id } });
    return found ? this.toDomain(found) : null;
  }

  async findByStoreId(storeId: string): Promise<StoreAddress[]> {
    const found = await this.ormRepository.find({
      where: { storeId },
      order: { isDefault: "DESC", createdAt: "DESC" },
    });
    return found.map((f) => this.toDomain(f));
  }

  async findDefaultByStoreId(storeId: string): Promise<StoreAddress | null> {
    const found = await this.ormRepository.findOne({
      where: { storeId, isDefault: true },
    });
    return found ? this.toDomain(found) : null;
  }

  async findDefaultPickupByStoreId(storeId: string): Promise<StoreAddress | null> {
    const found = await this.ormRepository.findOne({
      where: { storeId, isDefaultPickup: true },
    });
    return found ? this.toDomain(found) : null;
  }

  async findDefaultReturnByStoreId(storeId: string): Promise<StoreAddress | null> {
    const found = await this.ormRepository.findOne({
      where: { storeId, isDefaultReturn: true },
    });
    return found ? this.toDomain(found) : null;
  }

  async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }

  async resetDefaultAddress(storeId: string): Promise<void> {
    await this.ormRepository.update({ storeId }, { isDefault: false });
  }

  async resetDefaultPickupAddress(storeId: string): Promise<void> {
    await this.ormRepository.update({ storeId }, { isDefaultPickup: false });
  }

  async resetDefaultReturnAddress(storeId: string): Promise<void> {
    await this.ormRepository.update({ storeId }, { isDefaultReturn: false });
  }

  private toDomain(orm: StoreAddressOrmEntity): StoreAddress {
    return new StoreAddress({
      id: orm.id,
      storeId: orm.storeId,
      contactName: orm.contactName,
      phoneNumber: orm.phoneNumber,
      addressLine1: orm.addressLine1,
      addressLine2: orm.addressLine2,
      ward: orm.ward,
      district: orm.district,
      city: orm.city,
      country: orm.country ?? "Việt Nam",
      postalCode: orm.postalCode,
      latitude: orm.latitude,
      longitude: orm.longitude,
      isDefaultPickup: orm.isDefaultPickup,
      isDefaultReturn: orm.isDefaultReturn,
      isDefault: orm.isDefault,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
      deletedAt: orm.deletedAt,
    });
  }

  private toOrm(domain: StoreAddress): StoreAddressOrmEntity {
    const orm = new StoreAddressOrmEntity();
    if (domain.id) orm.id = domain.id;
    orm.storeId = domain.storeId;
    orm.contactName = domain.contactName;
    orm.phoneNumber = domain.phoneNumber;
    orm.addressLine1 = domain.addressLine1;
    orm.addressLine2 = domain.addressLine2;
    orm.ward = domain.ward;
    orm.district = domain.district;
    orm.city = domain.city;
    orm.country = domain.country;
    orm.postalCode = domain.postalCode;
    orm.latitude = domain.latitude;
    orm.longitude = domain.longitude;
    orm.isDefaultPickup = domain.isDefaultPickup;
    orm.isDefaultReturn = domain.isDefaultReturn;
    orm.isDefault = domain.isDefault;
    orm.createdAt = domain.createdAt;
    orm.updatedAt = domain.updatedAt;
    if (domain.deletedAt) orm.deletedAt = domain.deletedAt;
    return orm;
  }
}
