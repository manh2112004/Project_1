export interface CreateInventoryDto {
    productId: string;
    quantity: number;
    importPrice: number;
}

export interface InventoryResponseDto {
    id: string;
    productId: string;
    quantity: number;
    importPrice: number;
    createdAt: string;
    updatedAt: string;
}
