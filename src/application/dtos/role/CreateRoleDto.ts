export interface CreateRoleDto {
  name: string;
  description?: string;
  code: string;
}
export interface CreateRoleResponseDto {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}
export interface RoleResponseDto {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}
