import { AggregateRoot } from "../common/AggregateRoot";
import { UserStatus } from "../constant/UserStatus";
import { Email } from "../value-objects/Email";
import { Gender } from "../value-objects/Gender";
import { PhoneNumber } from "../value-objects/PhoneNumber";
import { UserSocialAccount } from "./UserSocialAccount";

export interface UserProps {
  id?: string;
  roleId: string;
  email: string;
  phoneNumber?: string;
  passwordHash?: string | null;
  fullName: string;
  avatarUrl?: string;
  dateOfBirth?: Date;
  gender: string;
  status?: string;
  emailVerifiedAt?: Date;
  phoneVerifiedAt?: Date;
  lastLoginAt?: Date;
  refreshToken?: string;
  socialAccounts?: UserSocialAccount[];
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface UpdateUserProps {
  fullName?: string;
  avatarUrl?: string;
  dateOfBirth?: Date;
  gender?: string;
  phoneNumber?: string;
}

export class User extends AggregateRoot {
  private _roleId: string;
  private _email: Email;
  private _phoneNumber?: PhoneNumber;
  private _passwordHash: string | null;
  private _fullName: string;
  private _avatarUrl?: string;
  private _dateOfBirth?: Date;
  private _gender: Gender;
  private _status: UserStatus;
  private _emailVerifiedAt: Date | null;
  private _phoneVerifiedAt: Date | null;
  private _lastLoginAt: Date | null;
  private _refreshToken: string | null;
  private _socialAccounts: UserSocialAccount[];

  constructor(props: UserProps) {
    super(props.id, props.createdAt, props.updatedAt, props.deletedAt);
    this._roleId = props.roleId;
    this._email = Email.create(props.email);
    this._phoneNumber = PhoneNumber.create(props.phoneNumber);
    this._passwordHash = props.passwordHash ?? null;
    this._fullName = props.fullName;
    this._avatarUrl = props.avatarUrl;
    this._dateOfBirth = props.dateOfBirth;
    this._gender = Gender.create(props.gender);
    this._status = (props.status as UserStatus) || UserStatus.ACTIVE;
    this._emailVerifiedAt = props.emailVerifiedAt ?? null;
    this._phoneVerifiedAt = props.phoneVerifiedAt ?? null;
    this._lastLoginAt = props.lastLoginAt ?? null;
    this._refreshToken = props.refreshToken ?? null;
    this._socialAccounts = props.socialAccounts ?? [];
  }

  public static create(props: {
    roleId: string;
    email: string;
    passwordHash?: string | null;
    fullName: string;
    phoneNumber?: string;
    gender: string;
    avatarUrl?: string;
    dateOfBirth?: Date;
  }): User {
    if (!props.fullName || props.fullName.trim().length === 0) {
      throw new Error("Họ và tên không được để trống.");
    }
    if (!props.email || !props.email.trim()) {
      throw new Error("Email không được để trống.");
    }
    return new User({
      roleId: props.roleId,
      email: props.email.toLowerCase().trim(),
      passwordHash: props.passwordHash ?? null,
      fullName: props.fullName.trim(),
      phoneNumber: props.phoneNumber,
      gender: props.gender,
      avatarUrl: props.avatarUrl,
      dateOfBirth: props.dateOfBirth,
      status: UserStatus.ACTIVE,
    });
  }

  public get roleId(): string {
    return this._roleId;
  }

  public get email(): string {
    return this._email.value;
  }

  public get phoneNumber(): string | undefined {
    return this._phoneNumber?.value;
  }

  public get passwordHash(): string | null {
    return this._passwordHash;
  }

  public get fullName(): string {
    return this._fullName;
  }

  public get avatarUrl(): string | undefined {
    return this._avatarUrl;
  }

  public get dateOfBirth(): Date | undefined {
    return this._dateOfBirth;
  }

  public get gender(): string {
    return this._gender.value;
  }

  public get status(): string {
    return this._status;
  }

  public get emailVerifiedAt(): Date | null {
    return this._emailVerifiedAt;
  }

  public get phoneVerifiedAt(): Date | null {
    return this._phoneVerifiedAt;
  }

  public get lastLoginAt(): Date | null {
    return this._lastLoginAt;
  }

  public get refreshToken(): string | null {
    return this._refreshToken;
  }

  public get socialAccounts(): UserSocialAccount[] {
    return [...this._socialAccounts];
  }

  // Phương thức thêm Social Account vào Aggregate Root
  public addSocialAccount(
    provider: string,
    subId: string,
    email?: string,
  ): UserSocialAccount {
    const existing = this._socialAccounts.find(
      (s) => s.provider === provider.toUpperCase().trim() && s.subId === subId.trim(),
    );
    if (existing) {
      return existing;
    }

    const socialAccount = UserSocialAccount.create({
      userId: this.id,
      provider,
      subId,
      email,
    });

    this._socialAccounts.push(socialAccount);
    this.touch();
    return socialAccount;
  }

  public hasSocialAccount(provider: string, subId: string): boolean {
    return this._socialAccounts.some(
      (s) => s.provider === provider.toUpperCase().trim() && s.subId === subId.trim(),
    );
  }

  public updateProfile(props: UpdateUserProps): void {
    if (props.fullName !== undefined) {
      if (!props.fullName || props.fullName.trim().length === 0) {
        throw new Error("Họ và tên không được để trống.");
      }
      this._fullName = props.fullName.trim();
    }
    if (props.phoneNumber !== undefined) {
      this._phoneNumber = props.phoneNumber
        ? PhoneNumber.create(props.phoneNumber)
        : undefined;
    }
    if (props.avatarUrl !== undefined) {
      this._avatarUrl = props.avatarUrl;
    }
    if (props.dateOfBirth !== undefined) {
      this._dateOfBirth = props.dateOfBirth;
    }
    if (props.gender !== undefined) {
      this._gender = Gender.create(props.gender);
    }
    this.touch();
  }

  // 1. Đổi mật khẩu
  public changePassword(newPasswordHash: string): void {
    if (!newPasswordHash || newPasswordHash.trim().length === 0) {
      throw new Error("Mật khẩu băm không được để trống.");
    }
    this._passwordHash = newPasswordHash;
    this.touch();
  }

  // 2. Thay đổi email (và reset trạng thái xác minh)
  public changeEmail(newEmail: string): void {
    this._email = Email.create(newEmail);
    this._emailVerifiedAt = null;
    this.touch();
  }

  // 3. Thay đổi vai trò (chỉ được thực hiện bởi Admin)
  public changeRole(newRoleId: string): void {
    if (!newRoleId || newRoleId.trim().length === 0) {
      throw new Error("Mã vai trò không hợp lệ.");
    }
    this._roleId = newRoleId;
    this.touch();
  }

  // 4. Xác minh email thành công
  public verifyEmail(): void {
    this._emailVerifiedAt = new Date();
    this.touch();
  }

  // 5. Xác minh số điện thoại thành công
  public verifyPhone(): void {
    this._phoneVerifiedAt = new Date();
    this.touch();
  }

  // 6. Cập nhật thời điểm đăng nhập cuối cùng
  public updateLastLogin(): void {
    this._lastLoginAt = new Date();
  }

  // 7. Cập nhật Refresh Token mới (hoặc thu hồi khi logout bằng cách truyền null)
  public updateRefreshToken(token: string | null): void {
    this._refreshToken = token;
    this.touch();
  }

  // 8. Khóa tài khoản
  public block(): void {
    this._status = UserStatus.BLOCKED;
    this.touch();
  }

  // 9. Kích hoạt tài khoản
  public activate(): void {
    this._status = UserStatus.ACTIVE;
    this.touch();
  }
}

