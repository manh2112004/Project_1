import { IProductRepository } from "../../../domain/repositories/IProductRepository";
import { IInventoryRepository } from "../../../domain/repositories/IInventoryRepository";
import { IProductImageRepository } from "../../../domain/repositories/IProductImageRepository";
export class DeleteProductUseCase {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly inventoryRepository: IInventoryRepository,
    private readonly productImageReposiotry: IProductImageRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new Error(`Sản phẩm với ID '${id}' không tồn tại.`);
    }
    const inventory = await this.inventoryRepository.findByProductId(id);
    if (inventory) {
      inventory.delete();
      await this.inventoryRepository.save(inventory);
    }
    const images = await this.productImageReposiotry.findByProductId(id);
    for (const image of images) {
      image.delete();
      await this.productImageReposiotry.save(image);
    }
    product.delete();
    await this.productRepository.save(product);
  }
}
