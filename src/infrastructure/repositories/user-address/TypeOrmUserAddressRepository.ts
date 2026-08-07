import { Repository } from "typeorm";
import { UserAddress } from "../../../domain/entities/UserAddress";
import { IUserAddressRepository } from "../../../domain/repositories/IUserAddressRepository";
import { UserAddressOrmEntity } from "../../database/entities/UserAddressOrmEntity";

export class TypeOrmUserAddressRepository implements IUserAddressRepository {
  constructor(private readonly ormRepository: Repository<UserAddressOrmEntity>) {}

  async save(userAddress: UserAddress): Promise<UserAddress> {
    const orm = this.toOrm(userAddress);
    const saved = await this.ormRepository.save(orm);
    return this.toDomain(saved);
  }

  async findById(id: string): Promise<UserAddress | null> {
    const found = await this.ormRepository.findOne({ where: { id } });
    return found ? this.toDomain(found) : null;
  }

  async findByUserId(userId: string): Promise<UserAddress[]> {
    const found = await this.ormRepository.find({
      where: { userId },
      order: { isDefault: "DESC", createdAt: "DESC" },
    });
    return found.map((f) => this.toDomain(f));
  }

  async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }

  async resetDefaultAddress(userId: string): Promise<void> {
    await this.ormRepository.update({ userId }, { isDefault: false });
  }

  private toDomain(orm: UserAddressOrmEntity): UserAddress {
    return new UserAddress({
      id: orm.id,
      userId: orm.userId,
      recipientName: orm.recipientName,
      phoneNumber: orm.phoneNumber,
      addressLine1: orm.addressLine1,
      addressLine2: orm.addressLine2 ?? undefined,
      ward: orm.ward,
      district: orm.district,
      city: orm.city,
      country: orm.country ?? undefined,
      postalCode: orm.postalCode ?? undefined,
      isDefault: orm.isDefault,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }

  private toOrm(domain: UserAddress): UserAddressOrmEntity {
    const orm = new UserAddressOrmEntity();
    if (domain.id) orm.id = domain.id;
    orm.userId = domain.userId;
    orm.recipientName = domain.recipientName;
    orm.phoneNumber = domain.phoneNumber;
    orm.addressLine1 = domain.addressLine1;
    orm.addressLine2 = domain.addressLine2 ?? null;
    orm.ward = domain.ward;
    orm.district = domain.district;
    orm.city = domain.city;
    orm.country = domain.country ?? null;
    orm.postalCode = domain.postalCode ?? null;
    orm.isDefault = domain.isDefault;
    orm.createdAt = domain.createdAt;
    orm.updatedAt = domain.updatedAt;
    return orm;
  }
}
