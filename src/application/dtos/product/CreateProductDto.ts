export interface CreateProductDto {
    storeId?: string | null;
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
    storeId?: string | null;
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
    store?: any;
    stockQuantity?: number;
    createdAt: string;
    updatedAt: string;
}
