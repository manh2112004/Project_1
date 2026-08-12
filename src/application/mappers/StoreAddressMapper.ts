import { StoreAddress } from "../../domain/entities/StoreAddress";
import { StoreAddressResponseDto } from "../dtos/store-address/StoreAddressDto";

export class StoreAddressMapper {
  public static toResponse(entity: StoreAddress): StoreAddressResponseDto {
    return {
      id: entity.id,
      storeId: entity.storeId,
      contactName: entity.contactName,
      phoneNumber: entity.phoneNumber,
      addressLine1: entity.addressLine1,
      addressLine2: entity.addressLine2,
      ward: entity.ward,
      district: entity.district,
      city: entity.city,
      country: entity.country,
      postalCode: entity.postalCode,
      latitude: entity.latitude,
      longitude: entity.longitude,
      isDefaultPickup: entity.isDefaultPickup,
      isDefaultReturn: entity.isDefaultReturn,
      isDefault: entity.isDefault,
      fullAddress: entity.fullAddress,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }

  public static toResponseList(entities: StoreAddress[]): StoreAddressResponseDto[] {
    return entities.map((entity) => this.toResponse(entity));
  }
}
