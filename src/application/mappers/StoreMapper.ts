import { Store } from "../../domain/entities/Store";
import { StoreResponseDto } from "../dtos/store/StoreDto";

export class StoreMapper {
  public static toResponse(entity: Store): StoreResponseDto {
    return {
      id: entity.id,
      userId: entity.userId,
      name: entity.name,
      description: entity.description,
      logo: entity.logo,
      coverImage: entity.coverImage,
      contactPhone: entity.contactPhone,
      contactEmail: entity.contactEmail,
      businessType: entity.businessType,
      taxCode: entity.taxCode,
      identityNumber: entity.identityNumber,
      status: entity.status,
      statusNote: entity.statusNote,
      isOnVacation: entity.isOnVacation,
      canAcceptOrders: entity.canAcceptOrders(),
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }

  public static toResponseList(entities: Store[]): StoreResponseDto[] {
    return entities.map((entity) => this.toResponse(entity));
  }
}
