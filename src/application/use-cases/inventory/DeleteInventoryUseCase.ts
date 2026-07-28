import { IInventoryRepository } from "../../../domain/repositories/IInventoryRepository";

export class DeleteInventoryUseCase {
  constructor(private readonly inventoryRepository: IInventoryRepository) {}

  async execute(id: string): Promise<void> {
    // 1. Kiểm tra tồn kho có tồn tại không
    const inventory = await this.inventoryRepository.findById(id);
    if (!inventory) {
      throw new Error(`Bản ghi tồn kho với ID '${id}' không tồn tại.`);
    }
    inventory.delete();
    await this.inventoryRepository.save(inventory);
  }
}
