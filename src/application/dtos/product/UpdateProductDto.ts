export interface UpdateProductDto {
    id: string;
    categoryId?: string;
    brandId?: string;
    name?: string;
    slug?: string;
    sku?: string;
    shortDescription?: string | null;
    description?: string | null;
    thumbnail?: string | null;
    price?: number;
    discountPrice?: number | null;
    status?: string;
}

export interface UpdateProductResponse {
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
    createdAt: string;
    updatedAt: string;
}
