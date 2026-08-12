import { Store } from "../../../domain/entities/Store";
import { IStoreRepository } from "../../../domain/repositories/IStoreRepository";
import { RegisterStoreDto } from "../../dtos/store/StoreDto";

export class RegisterStoreUseCase {
  constructor(private readonly storeRepository: IStoreRepository) {}

  async execute(dto: RegisterStoreDto): Promise<Store> {
    // Kiểm tra xem User đã từng đăng ký Store chưa
    const existingStore = await this.storeRepository.findByUserId(dto.userId);
    if (existingStore) {
      throw new Error("Người dùng đã có cửa hàng trên hệ thống.");
    }

    // Kiểm tra trùng tên cửa hàng
    const existingName = await this.storeRepository.findByName(dto.name);
    if (existingName) {
      throw new Error("Tên cửa hàng đã tồn tại trên hệ thống. Vui lòng chọn tên khác.");
    }

    // Nếu có mã số thuế thì kiểm tra trùng mã số thuế
    if (dto.taxCode && dto.taxCode.trim().length > 0) {
      const existingTax = await this.storeRepository.findByTaxCode(dto.taxCode);
      if (existingTax) {
        throw new Error("Mã số thuế này đã được đăng ký bởi cửa hàng khác.");
      }
    }

    // Nếu có số CCCD/CMND thì kiểm tra trùng CCCD/CMND
    if (dto.identityNumber && dto.identityNumber.trim().length > 0) {
      const existingId = await this.storeRepository.findByIdentityNumber(dto.identityNumber);
      if (existingId) {
        throw new Error("Số CCCD/CMND này đã được đăng ký bởi cửa hàng khác.");
      }
    }

    const store = Store.registerStore({
      userId: dto.userId,
      name: dto.name,
      description: dto.description,
      logo: dto.logo,
      coverImage: dto.coverImage,
      contactPhone: dto.contactPhone,
      contactEmail: dto.contactEmail,
      businessType: dto.businessType,
      taxCode: dto.taxCode,
      identityNumber: dto.identityNumber,
    });

    return await this.storeRepository.save(store);
  }
}
