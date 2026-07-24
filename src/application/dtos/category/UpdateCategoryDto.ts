export interface UpdateCategoryDto {
    id: string;
    name: string;
    slug?: string;
    parentId?: string | null;
    description?: string | null;
    image?: string | null;
    isActive?: boolean;
}
export interface ResponseUpdateCategoryDto {
    id: string,
    name: string,
    slug?: string,
    parentId?: string | null,
    description?: string | null,
    image?: string | null,
    isActive?: boolean,
    createdAt?: string,
    updatedAt?: string,
    deletedAt?: string | null,
}