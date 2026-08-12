import { Repository } from "typeorm";
import { Store } from "../../../domain/entities/Store";
import { StoreAddress } from "../../../domain/entities/StoreAddress";
import { IStoreRepository } from "../../../domain/repositories/IStoreRepository";
import { StoreStatus } from "../../../domain/constant/StoreStatus";
import { BusinessType } from "../../../domain/constant/BusinessType";
import { StoreOrmEntity } from "../../database/entities/StoreOrmEntity";
import { StoreAddressOrmEntity } from "../../database/entities/StoreAddressOrmEntity";

export class TypeOrmStoreRepository implements IStoreRepository {
  constructor(
    private readonly ormRepository: Repository<StoreOrmEntity>
  ) {}

  async save(store: Store): Promise<Store> {
    const orm = this.toOrm(store);
    const saved = await this.ormRepository.save(orm);
    return this.toDomain(saved);
  }

  async findById(id: string): Promise<Store | null> {
    const found = await this.ormRepository.findOne({
      where: { id },
      relations: { addresses: true },
    });
    return found ? this.toDomain(found) : null;
  }

  async findByUserId(userId: string): Promise<Store | null> {
    const found = await this.ormRepository.findOne({
      where: { userId },
      relations: { addresses: true },
    });
    return found ? this.toDomain(found) : null;
  }

  async findByName(name: string): Promise<Store | null> {
    const found = await this.ormRepository.findOne({
      where: { name: name.trim() },
      relations: { addresses: true },
    });
    return found ? this.toDomain(found) : null;
  }

  async findByTaxCode(taxCode: string): Promise<Store | null> {
    const found = await this.ormRepository.findOne({
      where: { taxCode: taxCode.trim() },
      relations: { addresses: true },
    });
    return found ? this.toDomain(found) : null;
  }

  async findByIdentityNumber(identityNumber: string): Promise<Store | null> {
    const found = await this.ormRepository.findOne({
      where: { identityNumber: identityNumber.trim() },
      relations: { addresses: true },
    });
    return found ? this.toDomain(found) : null;
  }

  async findAndCount(
    page: number,
    limit: number,
    search?: string,
    status?: StoreStatus
  ): Promise<{ stores: Store[]; totalCount: number }> {
    const queryBuilder = this.ormRepository
      .createQueryBuilder("store")
      .leftJoinAndSelect("store.addresses", "addresses");

    if (status) {
      queryBuilder.andWhere("store.status = :status", { status });
    }

    if (search) {
      queryBuilder.andWhere(
        "(unaccent(store.name) ILIKE unaccent(:search) OR store.contactEmail ILIKE :search OR store.contactPhone ILIKE :search)",
        { search: `%${search}%` }
      );
    }

    const [found, totalCount] = await queryBuilder
      .orderBy("store.createdAt", "DESC")
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      stores: found.map((orm) => this.toDomain(orm)),
      totalCount,
    };
  }

  async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }

  private toDomain(orm: StoreOrmEntity): Store {
    const addresses = orm.addresses
      ? orm.addresses.map(
          (addr) =>
            new StoreAddress({
              id: addr.id,
              storeId: addr.storeId,
              contactName: addr.contactName,
              phoneNumber: addr.phoneNumber,
              addressLine1: addr.addressLine1,
              addressLine2: addr.addressLine2,
              ward: addr.ward,
              district: addr.district,
              city: addr.city,
              country: addr.country ?? "Việt Nam",
              postalCode: addr.postalCode,
              latitude: addr.latitude,
              longitude: addr.longitude,
              isDefaultPickup: addr.isDefaultPickup,
              isDefaultReturn: addr.isDefaultReturn,
              isDefault: addr.isDefault,
              createdAt: addr.createdAt,
              updatedAt: addr.updatedAt,
              deletedAt: addr.deletedAt,
            })
        )
      : [];

    return new Store({
      id: orm.id,
      userId: orm.userId,
      name: orm.name,
      description: orm.description,
      logo: orm.logo,
      coverImage: orm.coverImage,
      contactPhone: orm.contactPhone ?? undefined,
      contactEmail: orm.contactEmail,
      businessType: orm.businessType as BusinessType,
      taxCode: orm.taxCode,
      identityNumber: orm.identityNumber,
      status: orm.status as StoreStatus,
      statusNote: orm.statusNote,
      isOnVacation: orm.isOnVacation,
      addresses,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }

  private toOrm(domain: Store): StoreOrmEntity {
    const orm = new StoreOrmEntity();
    if (domain.id) orm.id = domain.id;
    orm.userId = domain.userId;
    orm.name = domain.name;
    orm.description = domain.description;
    orm.logo = domain.logo;
    orm.coverImage = domain.coverImage;
    orm.contactPhone = domain.contactPhone ?? null;
    orm.contactEmail = domain.contactEmail;
    orm.businessType = domain.businessType;
    orm.taxCode = domain.taxCode;
    orm.identityNumber = domain.identityNumber;
    orm.status = domain.status;
    orm.statusNote = domain.statusNote;
    orm.isOnVacation = domain.isOnVacation;
    orm.createdAt = domain.createdAt;
    orm.updatedAt = domain.updatedAt;

    if (domain.addresses) {
      orm.addresses = domain.addresses.map((addr) => {
        const addrOrm = new StoreAddressOrmEntity();
        if (addr.id) addrOrm.id = addr.id;
        addrOrm.storeId = domain.id;
        addrOrm.contactName = addr.contactName;
        addrOrm.phoneNumber = addr.phoneNumber;
        addrOrm.addressLine1 = addr.addressLine1;
        addrOrm.addressLine2 = addr.addressLine2;
        addrOrm.ward = addr.ward;
        addrOrm.district = addr.district;
        addrOrm.city = addr.city;
        addrOrm.country = addr.country;
        addrOrm.postalCode = addr.postalCode;
        addrOrm.latitude = addr.latitude;
        addrOrm.longitude = addr.longitude;
        addrOrm.isDefaultPickup = addr.isDefaultPickup;
        addrOrm.isDefaultReturn = addr.isDefaultReturn;
        addrOrm.isDefault = addr.isDefault;
        addrOrm.createdAt = addr.createdAt;
        addrOrm.updatedAt = addr.updatedAt;
        if (addr.deletedAt) addrOrm.deletedAt = addr.deletedAt;
        return addrOrm;
      });
    }

    return orm;
  }
}
