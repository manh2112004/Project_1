export interface CreateCategoryDto {
  name: string;
  slug?: string;
  parentId?: string | null;
  description?: string | null;
  image?: string | null;
  isActive?: boolean;
}

export interface CategoryResponseDto {
  id: string;
  parentId: string | null;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
