import { Repository } from "typeorm";
import { User } from "../../../domain/entities/User";
import { UserSocialAccount } from "../../../domain/entities/UserSocialAccount";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { UserOrmEntity } from "../../database/entities/UserOrmEntity";
import { UserSocialAccountOrmEntity } from "../../database/entities/UserSocialAccountOrmEntity";

export class TypeOrmUserRepository implements IUserRepository {
  constructor(private readonly ormRepository: Repository<UserOrmEntity>) { }

  async save(user: User): Promise<User> {
    const ormEntity = this.toOrm(user);
    const savedOrm = await this.ormRepository.save(ormEntity);
    return this.toDomain(savedOrm);
  }

  async findById(id: string): Promise<User | null> {
    const found = await this.ormRepository.findOne({
      where: { id },
      relations: { socialAccounts: true },
    });
    return found ? this.toDomain(found) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const found = await this.ormRepository.findOne({
      where: { email: email.toLowerCase().trim() },
      relations: { socialAccounts: true },
    });
    return found ? this.toDomain(found) : null;
  }

  async findByPhoneNumber(phoneNumber: string): Promise<User | null> {
    const found = await this.ormRepository.findOne({
      where: { phoneNumber },
      relations: { socialAccounts: true },
    });
    return found ? this.toDomain(found) : null;
  }

  async findBySocialAccount(provider: string, subId: string): Promise<User | null> {
    const found = await this.ormRepository.findOne({
      where: {
        socialAccounts: {
          provider: provider.toUpperCase().trim(),
          subId: subId.trim(),
        },
      },
      relations: { socialAccounts: true },
    });
    return found ? this.toDomain(found) : null;
  }

  async findAndCount(
    page: number,
    limit: number,
    search?: string
  ): Promise<{ users: User[]; totalCount: number }> {
    const queryBuilder = this.ormRepository.createQueryBuilder("user")
      .leftJoinAndSelect("user.socialAccounts", "socialAccounts");

    if (search) {
      queryBuilder.where(
        "(unaccent(user.fullName) ILIKE unaccent(:search) OR user.email ILIKE :search)",
        { search: `%${search}%` }
      );
    }

    const [found, totalCount] = await queryBuilder
      .orderBy("user.createdAt", "DESC")
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      users: found.map((orm) => this.toDomain(orm)),
      totalCount,
    };
  }

  private toDomain(orm: UserOrmEntity): User {
    const socialAccounts = orm.socialAccounts
      ? orm.socialAccounts.map(
          (s) =>
            new UserSocialAccount({
              id: s.id,
              userId: s.userId,
              provider: s.provider,
              subId: s.subId,
              email: s.email ?? undefined,
              createdAt: s.createdAt,
              updatedAt: s.updatedAt,
            })
        )
      : [];

    return new User({
      id: orm.id,
      roleId: orm.roleId,
      email: orm.email,
      phoneNumber: orm.phoneNumber ?? undefined,
      passwordHash: orm.passwordHash,
      fullName: orm.fullName,
      avatarUrl: orm.avatarUrl ?? undefined,
      dateOfBirth: orm.dateOfBirth ?? undefined,
      gender: orm.gender,
      status: orm.status,
      emailVerifiedAt: orm.emailVerifiedAt ?? undefined,
      phoneVerifiedAt: orm.phoneVerifiedAt ?? undefined,
      lastLoginAt: orm.lastLoginAt ?? undefined,
      refreshToken: orm.refreshToken ?? undefined,
      socialAccounts,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
      deletedAt: orm.deletedAt,
    });
  }

  private toOrm(domain: User): UserOrmEntity {
    const orm = new UserOrmEntity();
    orm.id = domain.id;
    orm.roleId = domain.roleId;
    orm.email = domain.email;
    orm.phoneNumber = domain.phoneNumber ?? null;
    orm.passwordHash = domain.passwordHash;
    orm.fullName = domain.fullName;
    orm.avatarUrl = domain.avatarUrl ?? null;
    orm.dateOfBirth = domain.dateOfBirth ?? null;
    orm.gender = domain.gender;
    orm.status = domain.status;
    orm.emailVerifiedAt = domain.emailVerifiedAt;
    orm.phoneVerifiedAt = domain.phoneVerifiedAt;
    orm.lastLoginAt = domain.lastLoginAt;
    orm.refreshToken = domain.refreshToken;
    orm.createdAt = domain.createdAt;
    orm.updatedAt = domain.updatedAt;
    orm.deletedAt = domain.deletedAt;

    if (domain.socialAccounts) {
      orm.socialAccounts = domain.socialAccounts.map((s) => {
        const sOrm = new UserSocialAccountOrmEntity();
        if (s.id) sOrm.id = s.id;
        sOrm.userId = domain.id;
        sOrm.provider = s.provider;
        sOrm.subId = s.subId;
        sOrm.email = s.email ?? null;
        return sOrm;
      });
    }

    return orm;
  }
}

