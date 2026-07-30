import { randomUUID } from "node:crypto";

export interface PermissionProps {
  id?: string;
  name: string;
  module: string;
  description?: string | null;
  createdAt?: Date;
}

export class Permission {
  private readonly _id: string;
  private readonly _name: string;
  private readonly _module: string;
  private _description: string | null;
  private readonly _createdAt: Date;

  constructor(props: PermissionProps) {
    this._id = props.id || randomUUID();
    this._name = props.name.trim().toUpperCase();
    this._module = props.module.trim().toLowerCase();
    this._description = props.description ?? null;
    this._createdAt = props.createdAt || new Date();
  }

  public get id(): string {
    return this._id;
  }

  public get name(): string {
    return this._name;
  }

  public get module(): string {
    return this._module;
  }

  public get description(): string | null {
    return this._description;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  public static create(props: {
    name: string;
    module: string;
    description?: string;
  }): Permission {
    if (!props.name || props.name.trim().length === 0) {
      throw new Error("Tên quyền (name) không được để trống.");
    }
    if (!props.module || props.module.trim().length === 0) {
      throw new Error("Tên nhóm chức năng (module) không được để trống.");
    }

    return new Permission({
      name: props.name,
      module: props.module,
      description: props.description,
    });
  }

  // Chỉ cho phép cập nhật mô tả của quyền, giữ nguyên tên và module để đảm bảo an toàn hệ thống
  public updateDescription(description: string | null): void {
    this._description = description;
  }
}
