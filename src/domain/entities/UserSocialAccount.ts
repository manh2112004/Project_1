import { Entity } from "../common/Entity";

export interface UserSocialAccountProps {
  id?: string;
  userId: string;
  provider: string;
  subId: string;
  email?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class UserSocialAccount extends Entity {
  private _userId: string;
  private _provider: string;
  private _subId: string;
  private _email?: string;

  constructor(props: UserSocialAccountProps) {
    super(props.id, props.createdAt, props.updatedAt);
    this._userId = props.userId;
    this._provider = props.provider;
    this._subId = props.subId;
    this._email = props.email ? props.email.toLowerCase().trim() : undefined;
  }

  public static create(props: {
    userId: string;
    provider: string;
    subId: string;
    email?: string;
  }): UserSocialAccount {
    if (!props.userId || props.userId.trim().length === 0) {
      throw new Error("Mã người dùng (userId) không được để trống.");
    }
    if (!props.provider || props.provider.trim().length === 0) {
      throw new Error("Tên nhà cung cấp (provider) không được để trống.");
    }
    if (!props.subId || props.subId.trim().length === 0) {
      throw new Error("Mã định danh Sub ID không được để trống.");
    }

    return new UserSocialAccount({
      userId: props.userId,
      provider: props.provider.toUpperCase().trim(),
      subId: props.subId.trim(),
      email: props.email,
    });
  }

  public get userId(): string {
    return this._userId;
  }

  public get provider(): string {
    return this._provider;
  }

  public get subId(): string {
    return this._subId;
  }

  public get email(): string | undefined {
    return this._email;
  }
}
