import { Entity } from "../common/Entity";
import { PhoneNumber } from "../value-objects/PhoneNumber";

export interface StoreAddressProps {
  id?: string;
  storeId: string;
  contactName: string;
  phoneNumber?: string | null;
  addressLine1: string;
  addressLine2?: string | null;
  ward: string;
  district: string;
  city: string;
  country?: string;
  postalCode?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  isDefaultPickup?: boolean;
  isDefaultReturn?: boolean;
  isDefault?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface UpdateStoreAddressProps {
  contactName?: string;
  phoneNumber?: string | null;
  addressLine1?: string;
  addressLine2?: string | null;
  ward?: string;
  district?: string;
  city?: string;
  country?: string;
  postalCode?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  isDefaultPickup?: boolean;
  isDefaultReturn?: boolean;
  isDefault?: boolean;
}

export class StoreAddress extends Entity {
  private _storeId: string;
  private _contactName: string;
  private _phoneNumber: PhoneNumber | null;
  private _addressLine1: string;
  private _addressLine2: string | null;
  private _ward: string;
  private _district: string;
  private _city: string;
  private _country: string;
  private _postalCode: string | null;
  private _latitude: number | null;
  private _longitude: number | null;
  private _isDefaultPickup: boolean;
  private _isDefaultReturn: boolean;
  private _isDefault: boolean;

  constructor(props: StoreAddressProps) {
    super(props.id, props.createdAt, props.updatedAt, props.deletedAt);

    if (!props.storeId || props.storeId.trim().length === 0) {
      throw new Error("Mã cửa hàng không được để trống.");
    }
    if (!props.contactName || props.contactName.trim().length === 0) {
      throw new Error("Tên người liên hệ địa chỉ không được để trống.");
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
    if (props.latitude !== undefined && props.latitude !== null) {
      if (
        typeof props.latitude !== "number" ||
        props.latitude < -90 ||
        props.latitude > 90
      ) {
        throw new Error("Vĩ độ (latitude) phải trong khoảng từ -90 đến 90.");
      }
    }
    if (props.longitude !== undefined && props.longitude !== null) {
      if (
        typeof props.longitude !== "number" ||
        props.longitude < -180 ||
        props.longitude > 180
      ) {
        throw new Error(
          "Kinh độ (longitude) phải trong khoảng từ -180 đến 180.",
        );
      }
    }

    this._storeId = props.storeId;
    this._contactName = props.contactName.trim();
    this._phoneNumber =
      PhoneNumber.create(props.phoneNumber ?? undefined) ?? null;
    this._addressLine1 = props.addressLine1.trim();
    this._addressLine2 = props.addressLine2 ? props.addressLine2.trim() : null;
    this._ward = props.ward.trim();
    this._district = props.district.trim();
    this._city = props.city.trim();
    this._country = props.country ? props.country.trim() : "Việt Nam";
    this._postalCode = props.postalCode ? props.postalCode.trim() : null;
    this._latitude = props.latitude ?? null;
    this._longitude = props.longitude ?? null;
    this._isDefaultPickup = props.isDefaultPickup ?? false;
    this._isDefaultReturn = props.isDefaultReturn ?? false;
    this._isDefault = props.isDefault ?? false;
  }

  public static create(props: {
    storeId: string;
    contactName: string;
    phoneNumber?: string | null;
    addressLine1: string;
    addressLine2?: string | null;
    ward: string;
    district: string;
    city: string;
    country?: string;
    postalCode?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    isDefaultPickup?: boolean;
    isDefaultReturn?: boolean;
    isDefault?: boolean;
  }): StoreAddress {
    return new StoreAddress({
      storeId: props.storeId,
      contactName: props.contactName,
      phoneNumber: props.phoneNumber,
      addressLine1: props.addressLine1,
      addressLine2: props.addressLine2,
      ward: props.ward,
      district: props.district,
      city: props.city,
      country: props.country || "Việt Nam",
      postalCode: props.postalCode,
      latitude: props.latitude,
      longitude: props.longitude,
      isDefaultPickup: props.isDefaultPickup ?? false,
      isDefaultReturn: props.isDefaultReturn ?? false,
      isDefault: props.isDefault ?? false,
    });
  }

  public get storeId(): string {
    return this._storeId;
  }

  public get contactName(): string {
    return this._contactName;
  }

  public get phoneNumber(): string | null {
    return this._phoneNumber ? this._phoneNumber.value : null;
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

  public get latitude(): number | null {
    return this._latitude;
  }

  public get longitude(): number | null {
    return this._longitude;
  }

  public get isDefaultPickup(): boolean {
    return this._isDefaultPickup;
  }

  public get isDefaultReturn(): boolean {
    return this._isDefaultReturn;
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
  //Đặt địa chỉ này làm nơi Shipper đến "Lấy hàng" mặc định
  public markAsDefaultPickup(): void {
    this._isDefaultPickup = true;
    this.touch();
  }
  //Gỡ bỏ trạng thái "Lấy hàng" mặc định của địa chỉ này
  public unsetDefaultPickup(): void {
    this._isDefaultPickup = false;
    this.touch();
  }
  //Set trực tiếp trạng thái Lấy hàng
  public setDefaultPickup(isDefaultPickup: boolean): void {
    this._isDefaultPickup = isDefaultPickup;
    this.touch();
  }
  //Đặt địa chỉ này làm nơi "Nhận hàng hoàn" (khách bom/trả hàng) mặc định
  public markAsDefaultReturn(): void {
    this._isDefaultReturn = true;
    this.touch();
  }
  //Gỡ bỏ trạng thái "Nhận hàng hoàn" mặc định
  public unsetDefaultReturn(): void {
    this._isDefaultReturn = false;
    this.touch();
  }
  //
  public setDefaultReturn(isDefaultReturn: boolean): void {
    this._isDefaultReturn = isDefaultReturn;
    this.touch();
  }
  //Đặt địa chỉ này làm địa chỉ hiển thị chung mặc định của Shop
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

  public update(props: UpdateStoreAddressProps): void {
    if (props.contactName !== undefined) {
      if (!props.contactName || props.contactName.trim().length === 0) {
        throw new Error("Tên người liên hệ địa chỉ không được để trống.");
      }
      this._contactName = props.contactName.trim();
    }

    if (props.phoneNumber !== undefined) {
      this._phoneNumber =
        PhoneNumber.create(props.phoneNumber ?? undefined) ?? null;
    }

    if (props.addressLine1 !== undefined) {
      if (!props.addressLine1 || props.addressLine1.trim().length === 0) {
        throw new Error("Địa chỉ nhà / đường không được để trống.");
      }
      this._addressLine1 = props.addressLine1.trim();
    }

    if (props.addressLine2 !== undefined) {
      this._addressLine2 = props.addressLine2
        ? props.addressLine2.trim()
        : null;
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

    if (props.latitude !== undefined) {
      if (
        props.latitude !== null &&
        (typeof props.latitude !== "number" ||
          props.latitude < -90 ||
          props.latitude > 90)
      ) {
        throw new Error("Vĩ độ (latitude) phải trong khoảng từ -90 đến 90.");
      }
      this._latitude = props.latitude;
    }

    if (props.longitude !== undefined) {
      if (
        props.longitude !== null &&
        (typeof props.longitude !== "number" ||
          props.longitude < -180 ||
          props.longitude > 180)
      ) {
        throw new Error(
          "Kinh độ (longitude) phải trong khoảng từ -180 đến 180.",
        );
      }
      this._longitude = props.longitude;
    }

    if (props.isDefaultPickup !== undefined) {
      this._isDefaultPickup = props.isDefaultPickup;
    }

    if (props.isDefaultReturn !== undefined) {
      this._isDefaultReturn = props.isDefaultReturn;
    }

    if (props.isDefault !== undefined) {
      this._isDefault = props.isDefault;
    }

    this.touch();
  }
}
