import { User } from "../entities/User";

export interface IUserRepository {
  save(user: User): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByPhoneNumber(phoneNumber: string): Promise<User | null>;
  findBySocialAccount(provider: string, subId: string): Promise<User | null>;
  findAndCount(
    page: number,
    limit: number,
    search?: string
  ): Promise<{ users: User[]; totalCount: number }>;
}

