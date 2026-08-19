export interface updateBrandDto {
    id: string;
    name?: string;
    description?: string | null;
    logo?: string | null;
    isActive?: boolean;
}

export interface UpdateBrandResponse {
    id: string;
    name: string;
    description: string | null;
    logo: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}