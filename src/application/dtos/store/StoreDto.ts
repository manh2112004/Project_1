import { BusinessType } from "../../../domain/constant/BusinessType";
import { StoreStatus } from "../../../domain/constant/StoreStatus";

export interface RegisterStoreDto {
  userId: string;
  name: string;
  description?: string;
  logo?: string;
  coverImage?: string;
  contactPhone?: string;
  contactEmail: string;
  businessType: BusinessType;
  taxCode?: string;
  identityNumber?: string;
}

export interface UpdateStoreProfileDto {
  name: string;
  description?: string;
  logo?: string;
  coverImage?: string;
}

export interface UpdateStoreLegalInfoDto {
  taxCode?: string;
  identityNumber?: string;
}

export interface SuspendStoreDto {
  reason: string;
}

export interface RejectStoreDto {
  reason: string;
}

export interface GetStoresQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  status?: StoreStatus;
}

export interface StoreResponseDto {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  logo: string | null;
  coverImage: string | null;
  contactPhone?: string;
  contactEmail: string;
  businessType: BusinessType;
  taxCode: string | null;
  identityNumber: string | null;
  status: StoreStatus;
  statusNote: string | null;
  isOnVacation: boolean;
  canAcceptOrders: boolean;
  createdAt: string;
  updatedAt: string;
}
