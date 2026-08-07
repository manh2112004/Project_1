import { UserAddress } from "../../domain/entities/UserAddress";
import { UserAddressResponseDto } from "../dtos/user-address/CreateUserAddressDto";

export class UserAddressMapper {
  public static toResponse(entity: UserAddress): UserAddressResponseDto {
    return {
      id: entity.id,
      userId: entity.userId,
      recipientName: entity.recipientName,
      phoneNumber: entity.phoneNumber,
      addressLine1: entity.addressLine1,
      addressLine2: entity.addressLine2,
      ward: entity.ward,
      district: entity.district,
      city: entity.city,
      country: entity.country,
      postalCode: entity.postalCode,
      isDefault: entity.isDefault,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }

  public static toResponseList(entities: UserAddress[]): UserAddressResponseDto[] {
    return entities.map((entity) => this.toResponse(entity));
  }
}
