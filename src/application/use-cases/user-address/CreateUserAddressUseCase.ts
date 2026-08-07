import { UserAddress } from "../../../domain/entities/UserAddress";
import { IUserAddressRepository } from "../../../domain/repositories/IUserAddressRepository";
import { CreateUserAddressDto } from "../../dtos/user-address/CreateUserAddressDto";

export class CreateUserAddressUseCase {
  constructor(private readonly addressRepository: IUserAddressRepository) {}

  async execute(dto: CreateUserAddressDto): Promise<UserAddress> {
    // Kiểm tra nếu người dùng chưa có địa chỉ nào thì tự động đặt làm mặc định
    const existingAddresses = await this.addressRepository.findByUserId(dto.userId);
    const isFirstAddress = existingAddresses.length === 0;
    const shouldBeDefault = dto.isDefault || isFirstAddress;

    if (shouldBeDefault) {
      await this.addressRepository.resetDefaultAddress(dto.userId);
    }

    const address = UserAddress.create({
      userId: dto.userId,
      recipientName: dto.recipientName,
      phoneNumber: dto.phoneNumber,
      addressLine1: dto.addressLine1,
      addressLine2: dto.addressLine2,
      ward: dto.ward,
      district: dto.district,
      city: dto.city,
      country: dto.country,
      postalCode: dto.postalCode,
      isDefault: shouldBeDefault,
    });

    return await this.addressRepository.save(address);
  }
}
