import { Inventory } from "../../../domain/entities/Inventory";
import { IInventoryRepository } from "../../../domain/repositories/IInventoryRepository";
import { IProductRepository } from "../../../domain/repositories/IProductRepository";
import {
  CreateInventoryDto,
  InventoryResponseDto,
} from "../../dtos/inventory/CreateInventoryDto";

export class CreateInventoryUseCase {
  constructor(
    private readonly inventoryRepository: IInventoryRepository,
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(dto: CreateInventoryDto): Promise<InventoryResponseDto> {
    const product = await this.productRepository.findById(dto.productId);
    if (!product) {
      throw new Error(`Sản phẩm với ID '${dto.productId}' không tồn tại.`);
    }

    const existingInventory = await this.inventoryRepository.findByProductId(
      dto.productId,
    );
    if (existingInventory) {
      throw new Error(
        "Sản phẩm này đã được thiết lập tồn kho trước đó. Vui lòng cập nhật thay vì tạo mới.",
      );
    }

    const inventory = Inventory.create({
      productId: dto.productId,
      quantity: dto.quantity,
      importPrice: dto.importPrice,
    });

    const savedInventory = await this.inventoryRepository.save(inventory);

    // 5. Trả về Response DTO
    return {
      id: savedInventory.id,
      productId: savedInventory.productId,
      quantity: savedInventory.quantity,
      importPrice: savedInventory.importPrice,
      createdAt: savedInventory.createdAt.toISOString(),
      updatedAt: savedInventory.updatedAt.toISOString(),
    };
  }
}
