import { IUserAddressRepository } from "../../../domain/repositories/IUserAddressRepository";

export class DeleteUserAddressUseCase {
  constructor(private readonly addressRepository: IUserAddressRepository) {}

  async execute(id: string): Promise<void> {
    const address = await this.addressRepository.findById(id);
    if (!address) {
      throw new Error("Địa chỉ không tồn tại hoặc đã bị xóa.");
    }

    await this.addressRepository.delete(id);

    // Nếu vừa xóa địa chỉ mặc định, tự động chuyển 1 địa chỉ còn lại thành mặc định
    if (address.isDefault) {
      const remaining = await this.addressRepository.findByUserId(address.userId);
      if (remaining.length > 0) {
        remaining[0].markAsDefault();
        await this.addressRepository.save(remaining[0]);
      }
    }
  }
}
