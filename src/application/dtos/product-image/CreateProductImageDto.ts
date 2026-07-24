export interface CreateProductImageDto {
    productId: string;
    imageUrl: string;
    isThumbnail?: boolean;
    sortOrder?: number;
}

export interface ProductImageResponseDto {
    id: string;
    productId: string;
    imageUrl: string;
    isThumbnail: boolean;
    sortOrder: number;
    createdAt: string;
}
