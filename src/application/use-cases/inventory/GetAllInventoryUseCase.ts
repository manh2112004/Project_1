import { IInventoryRepository } from "../../../domain/repositories/IInventoryRepository";
import { InventoryResponseDto } from "../../dtos/inventory/CreateInventoryDto";

export class GetAllInventoryUseCase {
    constructor(private readonly inventoryRepository: IInventoryRepository) { }

    async execute(): Promise<InventoryResponseDto[]> {
        const inventories = await this.inventoryRepository.findAll();
        
        return inventories.map(inventory => ({
            id: inventory.id,
            productId: inventory.productId,
            quantity: inventory.quantity,
            importPrice: inventory.importPrice,
            createdAt: inventory.createdAt.toISOString(),
            updatedAt: inventory.updatedAt.toISOString()
        }));
    }
}
