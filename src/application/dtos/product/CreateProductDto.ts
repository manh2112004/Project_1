export interface CreateProductDto {
    categoryId: string;
    brandId: string;
    name: string;
    slug?: string;
    sku: string;
    shortDescription?: string | null;
    description?: string | null;
    thumbnail?: string | null;
    price: number;
    discountPrice?: number | null;
    status?: string;
}

export interface ProductResponseDto {
    id: string;
    categoryId: string;
    brandId: string;
    name: string;
    slug: string;
    sku: string;
    shortDescription: string | null;
    description: string | null;
    thumbnail: string | null;
    price: number;
    discountPrice: number | null;
    status: string;
    stockQuantity?: number;
    createdAt: string;
    updatedAt: string;
}
