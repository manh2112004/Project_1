export interface CreateStoreAddressDto {
  storeId: string;
  contactName: string;
  phoneNumber?: string;
  addressLine1: string;
  addressLine2?: string;
  ward: string;
  district: string;
  city: string;
  country?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  isDefaultPickup?: boolean;
  isDefaultReturn?: boolean;
  isDefault?: boolean;
}

export interface UpdateStoreAddressDto {
  contactName?: string;
  phoneNumber?: string;
  addressLine1?: string;
  addressLine2?: string;
  ward?: string;
  district?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  isDefaultPickup?: boolean;
  isDefaultReturn?: boolean;
  isDefault?: boolean;
}

export interface StoreAddressResponseDto {
  id: string;
  storeId: string;
  contactName: string;
  phoneNumber: string | null;
  addressLine1: string;
  addressLine2: string | null;
  ward: string;
  district: string;
  city: string;
  country: string;
  postalCode: string | null;
  latitude: number | null;
  longitude: number | null;
  isDefaultPickup: boolean;
  isDefaultReturn: boolean;
  isDefault: boolean;
  fullAddress: string;
  createdAt: string;
  updatedAt: string;
}
