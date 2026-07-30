export interface CreatePermissionDto {
  name: string;
  module: string;
  description?: string;
}

export interface PermissionResponseDto {
  id: string;
  name: string;
  module: string;
  description?: string;
  createdAt: string;
}

export interface PaginatedPermissionsResponse {
  permissions: PermissionResponseDto[];
  meta: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}
