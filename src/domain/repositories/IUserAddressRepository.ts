import { UserAddress } from "../entities/UserAddress";

export interface IUserAddressRepository {
  save(userAddress: UserAddress): Promise<UserAddress>;
  findById(id: string): Promise<UserAddress | null>;
  findByUserId(userId: string): Promise<UserAddress[]>;
  delete(id: string): Promise<void>;
  resetDefaultAddress(userId: string): Promise<void>;
}
