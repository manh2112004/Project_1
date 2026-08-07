import { UserAddress } from "../../../domain/entities/UserAddress";
import { IUserAddressRepository } from "../../../domain/repositories/IUserAddressRepository";

export class SetDefaultUserAddressUseCase {
  constructor(private readonly addressRepository: IUserAddressRepository) { }

  async execute(id: string): Promise<UserAddress> {
    const address = await this.addressRepository.findById(id);
    if (!address) {
      throw new Error("Không tìm thấy địa chỉ người dùng.");
    }

    await this.addressRepository.resetDefaultAddress(address.userId);
    address.markAsDefault();
    return await this.addressRepository.save(address);
  }
}
