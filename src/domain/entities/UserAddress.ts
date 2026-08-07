import { Entity } from "../common/Entity";
import { PhoneNumber } from "../value-objects/PhoneNumber";

export interface UserAddressProps {
  id?: string;
  userId: string;
  recipientName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string | null;
  ward: string;
  district: string;
  city: string;
  country?: string;
  postalCode?: string | null;
  isDefault?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface UpdateUserAddressProps {
  recipientName?: string;
  phoneNumber?: string;
  addressLine1?: string;
  addressLine2?: string | null;
  ward?: string;
  district?: string;
  city?: string;
  country?: string;
  postalCode?: string | null;
  isDefault?: boolean;
}

export class UserAddress extends Entity {
  private _userId: string;
  private _recipientName: string;
  private _phoneNumber: PhoneNumber;
  private _addressLine1: string;
  private _addressLine2: string | null;
  private _ward: string;
  private _district: string;
  private _city: string;
  private _country: string;
  private _postalCode: string | null;
  private _isDefault: boolean;

  constructor(props: UserAddressProps) {
    super(props.id, props.createdAt, props.updatedAt, props.deletedAt);
    
    if (!props.userId || props.userId.trim().length === 0) {
      throw new Error("Mã người dùng (userId) không được để trống.");
    }
    if (!props.recipientName || props.recipientName.trim().length === 0) {
      throw new Error("Tên người nhận không được để trống.");
    }
    const phone = PhoneNumber.create(props.phoneNumber);
    if (!phone) {
      throw new Error("Số điện thoại nhận hàng không hợp lệ.");
    }
    if (!props.addressLine1 || props.addressLine1.trim().length === 0) {
      throw new Error("Địa chỉ nhà / đường không được để trống.");
    }
    if (!props.ward || props.ward.trim().length === 0) {
      throw new Error("Phường / Xã không được để trống.");
    }
    if (!props.district || props.district.trim().length === 0) {
      throw new Error("Quận / Huyện không được để trống.");
    }
    if (!props.city || props.city.trim().length === 0) {
      throw new Error("Tỉnh / Thành phố không được để trống.");
    }

    this._userId = props.userId;
    this._recipientName = props.recipientName.trim();
    this._phoneNumber = phone;
    this._addressLine1 = props.addressLine1.trim();
    this._addressLine2 = props.addressLine2 ? props.addressLine2.trim() : null;
    this._ward = props.ward.trim();
    this._district = props.district.trim();
    this._city = props.city.trim();
    this._country = props.country ? props.country.trim() : "Việt Nam";
    this._postalCode = props.postalCode ? props.postalCode.trim() : null;
    this._isDefault = props.isDefault ?? false;
  }

  public static create(props: {
    userId: string;
    recipientName: string;
    phoneNumber: string;
    addressLine1: string;
    addressLine2?: string | null;
    ward: string;
    district: string;
    city: string;
    country?: string;
    postalCode?: string | null;
    isDefault?: boolean;
  }): UserAddress {
    return new UserAddress({
      userId: props.userId,
      recipientName: props.recipientName,
      phoneNumber: props.phoneNumber,
      addressLine1: props.addressLine1,
      addressLine2: props.addressLine2,
      ward: props.ward,
      district: props.district,
      city: props.city,
      country: props.country || "Việt Nam",
      postalCode: props.postalCode,
      isDefault: props.isDefault ?? false,
    });
  }

  public get userId(): string {
    return this._userId;
  }

  public get recipientName(): string {
    return this._recipientName;
  }

  public get phoneNumber(): string {
    return this._phoneNumber.value;
  }

  public get addressLine1(): string {
    return this._addressLine1;
  }

  public get addressLine2(): string | null {
    return this._addressLine2;
  }

  public get ward(): string {
    return this._ward;
  }

  public get district(): string {
    return this._district;
  }

  public get city(): string {
    return this._city;
  }

  public get country(): string {
    return this._country;
  }

  public get postalCode(): string | null {
    return this._postalCode;
  }

  public get isDefault(): boolean {
    return this._isDefault;
  }

  public get fullAddress(): string {
    const parts = [this._addressLine1];
    if (this._addressLine2) parts.push(this._addressLine2);
    parts.push(this._ward, this._district, this._city, this._country);
    return parts.join(", ");
  }

  public markAsDefault(): void {
    this._isDefault = true;
    this.touch();
  }

  public unsetDefault(): void {
    this._isDefault = false;
    this.touch();
  }

  public setDefault(isDefault: boolean): void {
    this._isDefault = isDefault;
    this.touch();
  }

  public update(props: UpdateUserAddressProps): void {
    if (props.recipientName !== undefined) {
      if (!props.recipientName || props.recipientName.trim().length === 0) {
        throw new Error("Tên người nhận không được để trống.");
      }
      this._recipientName = props.recipientName.trim();
    }

    if (props.phoneNumber !== undefined) {
      const phone = PhoneNumber.create(props.phoneNumber);
      if (!phone) {
        throw new Error("Số điện thoại nhận hàng không hợp lệ.");
      }
      this._phoneNumber = phone;
    }

    if (props.addressLine1 !== undefined) {
      if (!props.addressLine1 || props.addressLine1.trim().length === 0) {
        throw new Error("Địa chỉ nhà / đường không được để trống.");
      }
      this._addressLine1 = props.addressLine1.trim();
    }

    if (props.addressLine2 !== undefined) {
      this._addressLine2 = props.addressLine2 ? props.addressLine2.trim() : null;
    }

    if (props.ward !== undefined) {
      if (!props.ward || props.ward.trim().length === 0) {
        throw new Error("Phường / Xã không được để trống.");
      }
      this._ward = props.ward.trim();
    }

    if (props.district !== undefined) {
      if (!props.district || props.district.trim().length === 0) {
        throw new Error("Quận / Huyện không được để trống.");
      }
      this._district = props.district.trim();
    }

    if (props.city !== undefined) {
      if (!props.city || props.city.trim().length === 0) {
        throw new Error("Tỉnh / Thành phố không được để trống.");
      }
      this._city = props.city.trim();
    }

    if (props.country !== undefined) {
      this._country = props.country ? props.country.trim() : "Việt Nam";
    }

    if (props.postalCode !== undefined) {
      this._postalCode = props.postalCode ? props.postalCode.trim() : null;
    }

    if (props.isDefault !== undefined) {
      this._isDefault = props.isDefault;
    }

    this.touch();
  }
}
