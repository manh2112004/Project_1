import { UserAddress } from "../../../domain/entities/UserAddress";
import { IUserAddressRepository } from "../../../domain/repositories/IUserAddressRepository";
import { UpdateUserAddressDto } from "../../dtos/user-address/CreateUserAddressDto";

export class UpdateUserAddressUseCase {
  constructor(private readonly addressRepository: IUserAddressRepository) {}

  async execute(id: string, dto: UpdateUserAddressDto): Promise<UserAddress> {
    const address = await this.addressRepository.findById(id);
    if (!address) {
      throw new Error("Không tìm thấy địa chỉ người dùng.");
    }

    if (dto.isDefault) {
      await this.addressRepository.resetDefaultAddress(address.userId);
    }

    address.update(dto);
    return await this.addressRepository.save(address);
  }
}
