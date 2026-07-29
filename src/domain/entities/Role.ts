import { randomUUID } from "node:crypto";
export interface RoleProps {
  id?: string;
  name: string;
  description?: string | null;
  permissionCodes?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
export interface UpdateRoleProps {
  name?: string;
  description?: string | null;
}
export class Role {
  public readonly id: string;
  public name: string;
  public description: string | null;
  public permissionCodes: string[];
  public readonly createdAt: Date;
  public updatedAt: Date;
  constructor(props: RoleProps) {
    this.id = props.id || randomUUID();
    this.name = props.name.trim();
    this.description = props.description ?? null;
    this.permissionCodes = props.permissionCodes || [];
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }
  public static create(props: { name: string; description?: string }): Role {
    if (!props.name || props.name.trim().length === 0) {
      throw new Error("Tên vai trò không được để trống.");
    }
    return new Role({
      name: props.name.trim(),
      description: props.description,
    });
  }
  public update(props: UpdateRoleProps): void {
    if (props.name !== undefined) {
      if (!props.name || props.name.trim().length === 0) {
        throw new Error("Tên vai trò không được để trống.");
      }
      this.name = props.name.trim();
    }
    if (props.description !== undefined) {
      this.description = props.description;
    }
    this.updatedAt = new Date();
  }
  //gán quyển
  public assignPermission(permissionCode: string): void {
    if (!this.permissionCodes.includes(permissionCode)) {
      this.permissionCodes.push(permissionCode);
      this.updatedAt = new Date();
    }
  }
  //thu hồi quyền
  public revokePermission(permissionCode: string): void {
    if (this.permissionCodes.includes(permissionCode)) {
      this.permissionCodes = this.permissionCodes.filter(
        (code) => code !== permissionCode,
      );
      this.updatedAt = new Date();
    }
  }
  //Kiểm tra xem vai trò này có quyền được yêu cầu hay không
  public hasPermission(permissionCode: string): boolean {
    return this.permissionCodes.includes(permissionCode);
  }
}
