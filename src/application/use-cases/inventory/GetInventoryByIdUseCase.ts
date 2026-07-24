import { IInventoryRepository } from "../../../domain/repositories/IInventoryRepository";
import { InventoryResponseDto } from "../../dtos/inventory/CreateInventoryDto";

export class GetInventoryByIdUseCase {
    constructor(private readonly inventoryRepository: IInventoryRepository) { }

    async execute(id: string): Promise<InventoryResponseDto> {
        const inventory = await this.inventoryRepository.findById(id);
        if (!inventory) {
            throw new Error(`Bản ghi tồn kho với ID '${id}' không tồn tại.`);
        }

        return {
            id: inventory.id,
            productId: inventory.productId,
            quantity: inventory.quantity,
            importPrice: inventory.importPrice,
            createdAt: inventory.createdAt.toISOString(),
            updatedAt: inventory.updatedAt.toISOString()
        };
    }
}
