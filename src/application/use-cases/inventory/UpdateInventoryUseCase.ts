import { IInventoryRepository } from "../../../domain/repositories/IInventoryRepository";
import { UpdateInventoryDto, UpdateInventoryResponse } from "../../dtos/inventory/UpdateInventoryDto";

export class UpdateInventoryUseCase {
    constructor(private readonly inventoryRepository: IInventoryRepository) { }

    async execute(dto: UpdateInventoryDto): Promise<UpdateInventoryResponse> {
        // 1. Tìm bản ghi kho
        const inventory = await this.inventoryRepository.findById(dto.id);
        if (!inventory) {
            throw new Error(`Bản ghi tồn kho với ID '${dto.id}' không tồn tại.`);
        }

        // 2. Cập nhật thông tin thực thể
        inventory.update({
            quantity: dto.quantity,
            importPrice: dto.importPrice
        });

        // 3. Lưu vào DB
        const savedInventory = await this.inventoryRepository.save(inventory);

        // 4. Trả về Response DTO
        return {
            id: savedInventory.id,
            productId: savedInventory.productId,
            quantity: savedInventory.quantity,
            importPrice: savedInventory.importPrice,
            createdAt: savedInventory.createdAt.toISOString(),
            updatedAt: savedInventory.updatedAt.toISOString()
        };
    }
}
