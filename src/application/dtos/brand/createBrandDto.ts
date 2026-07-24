export interface createBrandDto {
    name: string;
    description?: string | null;
    logo?: string | null;
    isActive?: boolean;
}
export interface BrandResponseDto {
    id: string;
    name: string;
    description: string | null;
    logo: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}