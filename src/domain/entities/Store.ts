import { AggregateRoot } from "../common/AggregateRoot";
import { BusinessType } from "../constant/BusinessType";
import { StoreStatus } from "../constant/StoreStatus";
import { Email } from "../value-objects/Email";
import { PhoneNumber } from "../value-objects/PhoneNumber";
import { StoreAddress } from "./StoreAddress";

export interface StoreProps {
  id?: string;
  userId: string;
  name: string;
  description?: string | null;
  logo?: string | null;
  coverImage?: string | null;
  contactPhone?: string;
  contactEmail: string;
  businessType: BusinessType;
  taxCode?: string | null;
  identityNumber?: string | null;
  status: StoreStatus;
  statusNote?: string | null;
  isOnVacation: boolean;
  addresses?: StoreAddress[];
  createdAt?: Date;
  updatedAt?: Date;
}

export class Store extends AggregateRoot {
  private _userId: string;
  private _name: string;
  private _description: string | null;
  private _logo: string | null;
  private _coverImage: string | null;
  private _contactPhone?: PhoneNumber;
  private _contactEmail: Email;
  private _businessType: BusinessType;
  private _taxCode: string | null;
  private _identityNumber: string | null;
  private _status: StoreStatus;
  private _statusNote: string | null;
  private _isOnVacation: boolean;
  private _addresses: StoreAddress[];

  constructor(props: StoreProps) {
    super(props.id, props.createdAt, props.updatedAt);
    this._userId = props.userId;
    this._name = props.name;
    this._description = props.description ?? null;
    this._logo = props.logo ?? null;
    this._coverImage = props.coverImage ?? null;
    this._contactPhone = PhoneNumber.create(props.contactPhone);
    this._contactEmail = Email.create(props.contactEmail);
    this._businessType = props.businessType;
    this._taxCode = props.taxCode ?? null;
    this._identityNumber = props.identityNumber ?? null;
    this._status = props.status;
    this._statusNote = props.statusNote ?? null;
    this._isOnVacation = props.isOnVacation;
    this._addresses = props.addresses || [];
  }

  public static registerStore(props: {
    userId: string;
    name: string;
    description?: string | null;
    logo?: string | null;
    coverImage?: string | null;
    contactPhone?: string;
    contactEmail: string;
    businessType: BusinessType;
    taxCode?: string | null;
    identityNumber?: string | null;
  }): Store {
    if (!props.name || props.name.trim().length === 0) {
      throw new Error("Tên cửa hàng không được để trống.");
    }
    if (
      props.businessType === BusinessType.ENTERPRISE &&
      (!props.taxCode || props.taxCode.trim().length === 0)
    ) {
      throw new Error(
        "Doanh nghiệp đăng ký cửa hàng bắt buộc phải cung cấp Mã số thuế.",
      );
    }
    if (
      props.businessType === BusinessType.PERSONAL &&
      (!props.identityNumber || props.identityNumber.trim().length === 0)
    ) {
      throw new Error(
        "Cá nhân đăng ký cửa hàng bắt buộc phải cung cấp Số CCCD/CMND.",
      );
    }

    return new Store({
      userId: props.userId,
      name: props.name,
      description: props.description,
      logo: props.logo,
      coverImage: props.coverImage,
      contactPhone: props.contactPhone,
      contactEmail: props.contactEmail,
      businessType: props.businessType,
      taxCode: props.taxCode,
      identityNumber: props.identityNumber,
      status: StoreStatus.PENDING,
      statusNote: null,
      isOnVacation: false,
    });
  }

  // Kiểm tra cửa hàng có sẵn sàng nhận đơn đặt hàng hay không
  public canAcceptOrders(): boolean {
    return this._status === StoreStatus.ACTIVE && !this._isOnVacation;
  }

  public updateProfile(props: {
    name: string;
    description?: string | null;
    logo?: string | null;
    coverImage?: string | null;
  }): void {
    if (this._status === StoreStatus.SUSPENDED) {
      throw new Error("Cửa hàng đang bị khóa, không thể cập nhật hồ sơ.");
    }
    if (!props.name || props.name.trim().length === 0) {
      throw new Error("Tên cửa hàng không được để trống.");
    }
    this._name = props.name;
    if (props.description !== undefined) this._description = props.description;
    if (props.logo !== undefined) this._logo = props.logo;
    if (props.coverImage !== undefined) this._coverImage = props.coverImage;
  }

  public changeContactEmail(newEmail: string): void {
    if (this._status === StoreStatus.SUSPENDED) {
      throw new Error("Cửa hàng đang bị khóa, không thể thay đổi Email.");
    }
    if (this._contactEmail.value === newEmail) return;
    this._contactEmail = Email.create(newEmail);
  }

  public changeContactPhone(newPhone?: string): void {
    if (this._status === StoreStatus.SUSPENDED) {
      throw new Error(
        "Cửa hàng đang bị khóa, không thể thay đổi Số điện thoại.",
      );
    }
    if (this._contactPhone?.value === newPhone) return;
    this._contactPhone = PhoneNumber.create(newPhone);
  }

  public approve(): void {
    if (this._status === StoreStatus.ACTIVE) {
      throw new Error(
        "Cửa hàng đã ở trạng thái hoạt động, không thể duyệt lại.",
      );
    }
    this._status = StoreStatus.ACTIVE;
    this._statusNote = null;
  }

  public suspend(reason: string): void {
    if (this._status === StoreStatus.SUSPENDED) {
      throw new Error("Cửa hàng đã bị khóa trước đó.");
    }
    if (!reason || reason.trim().length === 0) {
      throw new Error("Bắt buộc phải nhập lý do khi khóa cửa hàng.");
    }
    this._status = StoreStatus.SUSPENDED;
    this._statusNote = reason;
  }

  public reject(reason: string): void {
    if (this._status !== StoreStatus.PENDING) {
      throw new Error(
        "Chỉ có thể từ chối khi cửa hàng đang ở trạng thái chờ duyệt.",
      );
    }
    if (!reason || reason.trim().length === 0) {
      throw new Error("Bắt buộc phải nhập lý do từ chối.");
    }
    this._status = StoreStatus.REJECTED;
    this._statusNote = reason;
  }

  public reactivate(): void {
    if (this._status !== StoreStatus.SUSPENDED) {
      throw new Error("Chỉ có thể mở khóa các cửa hàng đang bị đình chỉ/khóa.");
    }
    this._status = StoreStatus.ACTIVE;
    this._statusNote = null;
  }

  public enableVacationMode(): void {
    if (this._status === StoreStatus.SUSPENDED) {
      throw new Error(
        "Cửa hàng đang bị khóa, không thể thao tác chế độ tạm nghỉ.",
      );
    }
    this._isOnVacation = true;
  }

  public disableVacationMode(): void {
    this._isOnVacation = false;
  }

  public updateLegalInfo(
    newTaxCode?: string | null,
    newIdentityNumber?: string | null,
  ): void {
    if (this._status === StoreStatus.SUSPENDED) {
      throw new Error("Cửa hàng đang bị khóa, không thể cập nhật giấy tờ.");
    }
    if (
      this._businessType === BusinessType.ENTERPRISE &&
      (!newTaxCode || newTaxCode.trim() === "")
    ) {
      throw new Error("Doanh nghiệp bắt buộc phải có Mã số thuế.");
    }
    this._taxCode = newTaxCode ?? null;
    this._identityNumber = newIdentityNumber ?? null;

    // Ép cửa hàng về trạng thái Chờ duyệt lại
    this._status = StoreStatus.PENDING;
    this._statusNote =
      "Chủ cửa hàng vừa cập nhật giấy tờ pháp lý. Cần duyệt lại.";
  }

  // Getters & Setters
  public get userId(): string {
    return this._userId;
  }
  public get name(): string {
    return this._name;
  }
  public get description(): string | null {
    return this._description;
  }
  public get logo(): string | null {
    return this._logo;
  }
  public get coverImage(): string | null {
    return this._coverImage;
  }
  public get contactPhone(): string | undefined {
    return this._contactPhone?.value;
  }
  public get contactEmail(): string {
    return this._contactEmail.value;
  }
  public get businessType(): BusinessType {
    return this._businessType;
  }
  public get taxCode(): string | null {
    return this._taxCode;
  }
  public get identityNumber(): string | null {
    return this._identityNumber;
  }
  public get status(): StoreStatus {
    return this._status;
  }
  public get statusNote(): string | null {
    return this._statusNote;
  }
  public get isOnVacation(): boolean {
    return this._isOnVacation;
  }
  public get addresses(): ReadonlyArray<StoreAddress> {
    return this._addresses;
  }

  // Quản lý danh sách địa chỉ kho/cửa hàng
  public addAddress(address: StoreAddress): void {
    if (address.storeId !== this.id) {
      throw new Error("Địa chỉ không thuộc về cửa hàng này.");
    }

    if (address.isDefault) {
      this._addresses.forEach((addr) => addr.unsetDefault());
    }
    if (address.isDefaultPickup) {
      this._addresses.forEach((addr) => addr.unsetDefaultPickup());
    }
    if (address.isDefaultReturn) {
      this._addresses.forEach((addr) => addr.unsetDefaultReturn());
    }

    this._addresses.push(address);
    this.touch();
  }

  public removeAddress(addressId: string): void {
    this._addresses = this._addresses.filter((addr) => addr.id !== addressId);
    this.touch();
  }

  public setAddresses(addresses: StoreAddress[]): void {
    this._addresses = addresses;
    this.touch();
  }

  public getDefaultAddress(): StoreAddress | undefined {
    return this._addresses.find((addr) => addr.isDefault);
  }

  public getDefaultPickupAddress(): StoreAddress | undefined {
    return this._addresses.find((addr) => addr.isDefaultPickup);
  }

  public getDefaultReturnAddress(): StoreAddress | undefined {
    return this._addresses.find((addr) => addr.isDefaultReturn);
  }
}
