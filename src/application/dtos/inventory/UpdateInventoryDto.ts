export interface UpdateInventoryDto {
    id: string;
    quantity?: number;
    importPrice?: number;
}

export interface UpdateInventoryResponse {
    id: string;
    productId: string;
    quantity: number;
    importPrice: number;
    createdAt: string;
    updatedAt: string;
}
