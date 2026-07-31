import { randomUUID } from "node:crypto";
import { Entity } from "../common/Entity";
export interface RoleProps {
  id?: string;
  name: string;
  description?: string | null;
  permissionCodes?: string[];
  code?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}
export interface UpdateRoleProps {
  name?: string;
  description?: string | null;
}
export class Role extends Entity {
  private _name: string;
  private _description: string | null;
  private _permissionCodes: string[];
  private _code: string;

  constructor(props: RoleProps) {
    super(props.id, props.createdAt, props.updatedAt, props.deletedAt);
    this._name = props.name.trim();
    this._description = props.description ?? null;
    this._permissionCodes = props.permissionCodes || [];
    this._code = props.code || Role.generateCode(props.name);
  }

  public get name(): string {
    return this._name;
  }
  public get code(): string {
    return this._code;
  }
  public get description(): string | null {
    return this._description;
  }
  public get permissionCodes(): string[] {
    return [...this._permissionCodes];
  }

  public static create(props: {
    name: string;
    description?: string;
    code?: string;
  }): Role {
    if (!props.name || props.name.trim().length === 0) {
      throw new Error("Tên vai trò không được để trống.");
    }
    return new Role({
      name: props.name.trim(),
      description: props.description,
      code: props.code,
    });
  }

  public update(props: UpdateRoleProps): void {
    if (props.name !== undefined) {
      if (!props.name || props.name.trim().length === 0) {
        throw new Error("Tên vai trò không được để trống.");
      }
      this._name = props.name.trim();
    }
    if (props.description !== undefined) {
      this._description = props.description;
    }
    this.touch();
  }

  //gán quyển
  public assignPermission(permissionCode: string): void {
    if (!this._permissionCodes.includes(permissionCode)) {
      this._permissionCodes.push(permissionCode);
      this.touch();
    }
  }

  //thu hồi quyền
  public revokePermission(permissionCode: string): void {
    if (this._permissionCodes.includes(permissionCode)) {
      this._permissionCodes = this._permissionCodes.filter(
        (code) => code !== permissionCode,
      );
      this.touch();
    }
  }

  //Kiểm tra xem vai trò này có quyền được yêu cầu hay không
  public hasPermission(permissionCode: string): boolean {
    return this._permissionCodes.includes(permissionCode);
  }
  private static generateCode(name: string): string {
    return name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Loại bỏ dấu tiếng Việt
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .toUpperCase()
      .trim()
      .replace(/[^A-Z0-9]+/g, "_"); // Thay thế khoảng trắng và ký tự đặc biệt bằng "_"
  }
}
