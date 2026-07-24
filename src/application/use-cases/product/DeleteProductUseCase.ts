import { IProductRepository } from "../../../domain/repositories/IProductRepository";
import { IInventoryRepository } from "../../../domain/repositories/IInventoryRepository";
import { IProductImageRepository } from "../../../domain/repositories/IProductImageRepository";
export class DeleteProductUseCase {
    constructor(private readonly productRepository: IProductRepository,
                private readonly inventoryRepository:IInventoryRepository,
                private readonly productImageReposiotry:IProductImageRepository
    ) { }

    async execute(id: string): Promise<void> {
        const product = await this.productRepository.findById(id);
        if (!product) {
            throw new Error(`Sản phẩm với ID '${id}' không tồn tại.`);
        }
        const inventory=await this.inventoryRepository.findByProductId(id);
        if(inventory){
            await this.inventoryRepository.delete(inventory.id)
        }
        const images=await this.productImageReposiotry.findByProductId(id);
        for(const image of images){
            await this.productImageReposiotry.delete(image.id);
        }
        product.delete();
        await this.productRepository.save(product);
    }
}
