export interface RolePermissionsDto {
  roleId: string;
  permissionCodes: string[];
}

export interface RolePermissionsResponseDto {
  id: string;
  name: string;
  description?: string;
  permissionCodes: string[];
  updatedAt: string;
}
