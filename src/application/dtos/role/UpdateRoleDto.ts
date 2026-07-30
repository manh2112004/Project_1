export interface UpdateRoleDto {
  id: string;
  name: string;
  description?: string;
}
export interface UpdateRoleResponseDto {
  id: string;
  name: string;
  description?: string;
  updatedAt: string;
}
