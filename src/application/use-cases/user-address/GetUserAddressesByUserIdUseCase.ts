import { UserAddress } from "../../../domain/entities/UserAddress";
import { IUserAddressRepository } from "../../../domain/repositories/IUserAddressRepository";

export class GetUserAddressesByUserIdUseCase {
  constructor(private readonly addressRepository: IUserAddressRepository) {}

  async execute(userId: string): Promise<UserAddress[]> {
    return await this.addressRepository.findByUserId(userId);
  }
}
