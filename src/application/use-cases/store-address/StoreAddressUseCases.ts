import { StoreAddress } from "../../../domain/entities/StoreAddress";
import { IStoreAddressRepository } from "../../../domain/repositories/IStoreAddressRepository";
import { IStoreRepository } from "../../../domain/repositories/IStoreRepository";
import {
  CreateStoreAddressDto,
  UpdateStoreAddressDto,
} from "../../dtos/store-address/StoreAddressDto";

export class CreateStoreAddressUseCase {
  constructor(
    private readonly addressRepository: IStoreAddressRepository,
    private readonly storeRepository: IStoreRepository
  ) { }

  async execute(dto: CreateStoreAddressDto): Promise<StoreAddress> {
    const store = await this.storeRepository.findById(dto.storeId);
    if (!store) {
      throw new Error("Không tìm thấy cửa hàng.");
    }

    const existingAddresses = await this.addressRepository.findByStoreId(dto.storeId);
    const isFirstAddress = existingAddresses.length === 0;
    // 1. Quyết định xem có phải là địa chỉ mặc định chung hay không
    const shouldBeDefault = dto.isDefault ?? isFirstAddress;
    // 2. Quyết định xem có phải là địa chỉ điểm Lấy hàng (giao cho Shipper) mặc định hay không
    const shouldBeDefaultPickup = dto.isDefaultPickup ?? isFirstAddress;
    // 3. Quyết định xem có phải là địa chỉ điểm Trả hàng (Shipper trả về) mặc định hay không
    const shouldBeDefaultReturn = dto.isDefaultReturn ?? isFirstAddress;

    if (shouldBeDefault) {
      await this.addressRepository.resetDefaultAddress(dto.storeId);
    }
    if (shouldBeDefaultPickup) {
      await this.addressRepository.resetDefaultPickupAddress(dto.storeId);
    }
    if (shouldBeDefaultReturn) {
      await this.addressRepository.resetDefaultReturnAddress(dto.storeId);
    }

    const address = StoreAddress.create({
      storeId: dto.storeId,
      contactName: dto.contactName,
      phoneNumber: dto.phoneNumber,
      addressLine1: dto.addressLine1,
      addressLine2: dto.addressLine2,
      ward: dto.ward,
      district: dto.district,
      city: dto.city,
      country: dto.country,
      postalCode: dto.postalCode,
      latitude: dto.latitude,
      longitude: dto.longitude,
      isDefaultPickup: shouldBeDefaultPickup,
      isDefaultReturn: shouldBeDefaultReturn,
      isDefault: shouldBeDefault,
    });

    return await this.addressRepository.save(address);
  }
}

export class UpdateStoreAddressUseCase {
  constructor(private readonly addressRepository: IStoreAddressRepository) { }

  async execute(addressId: string, dto: UpdateStoreAddressDto): Promise<StoreAddress> {
    const address = await this.addressRepository.findById(addressId);
    if (!address) {
      throw new Error("Không tìm thấy địa chỉ cửa hàng.");
    }

    if (dto.isDefault) {
      await this.addressRepository.resetDefaultAddress(address.storeId);
    }
    if (dto.isDefaultPickup) {
      await this.addressRepository.resetDefaultPickupAddress(address.storeId);
    }
    if (dto.isDefaultReturn) {
      await this.addressRepository.resetDefaultReturnAddress(address.storeId);
    }

    address.update(dto);
    return await this.addressRepository.save(address);
  }
}

export class GetStoreAddressesByStoreIdUseCase {
  constructor(private readonly addressRepository: IStoreAddressRepository) { }

  async execute(storeId: string): Promise<StoreAddress[]> {
    return await this.addressRepository.findByStoreId(storeId);
  }
}

export class DeleteStoreAddressUseCase {
  constructor(private readonly addressRepository: IStoreAddressRepository) { }

  async execute(addressId: string): Promise<void> {
    const address = await this.addressRepository.findById(addressId);
    if (!address) {
      throw new Error("Không tìm thấy địa chỉ cửa hàng.");
    }
    await this.addressRepository.delete(addressId);
  }
}

export class SetDefaultStoreAddressUseCase {
  constructor(private readonly addressRepository: IStoreAddressRepository) { }

  async execute(
    addressId: string,
    type: "default" | "pickup" | "return"
  ): Promise<StoreAddress> {
    const address = await this.addressRepository.findById(addressId);
    if (!address) {
      throw new Error("Không tìm thấy địa chỉ cửa hàng.");
    }

    if (type === "default") {
      await this.addressRepository.resetDefaultAddress(address.storeId);
      address.markAsDefault();
    } else if (type === "pickup") {
      await this.addressRepository.resetDefaultPickupAddress(address.storeId);
      address.markAsDefaultPickup();
    } else if (type === "return") {
      await this.addressRepository.resetDefaultReturnAddress(address.storeId);
      address.markAsDefaultReturn();
    }

    return await this.addressRepository.save(address);
  }
}
