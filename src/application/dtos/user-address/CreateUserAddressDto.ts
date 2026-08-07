export interface CreateUserAddressDto {
  userId: string;
  recipientName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  ward: string;
  district: string;
  city: string;
  country?: string;
  postalCode?: string;
  isDefault?: boolean;
}

export interface UpdateUserAddressDto {
  recipientName?: string;
  phoneNumber?: string;
  addressLine1?: string;
  addressLine2?: string;
  ward?: string;
  district?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  isDefault?: boolean;
}

export interface UserAddressResponseDto {
  id: string;
  userId: string;
  recipientName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string | null;
  ward: string;
  district: string;
  city: string;
  country?: string | null;
  postalCode?: string | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}
