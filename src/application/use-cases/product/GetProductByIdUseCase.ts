import { IProductRepository } from "../../../domain/repositories/IProductRepository";
import { ProductResponseDto } from "../../dtos/product/CreateProductDto";

export class GetProductByIdUseCase {
    constructor(private readonly productRepository: IProductRepository) { }

    async execute(id: string): Promise<ProductResponseDto> {
        const product = await this.productRepository.findById(id);
        if (!product) {
            throw new Error(`Sản phẩm với ID '${id}' không tồn tại.`);
        }

        return {
            id: product.id,
            categoryId: product.categoryId,
            brandId: product.brandId,
            name: product.name,
            slug: product.slug,
            sku: product.sku,
            shortDescription: product.shortDescription,
            description: product.description,
            thumbnail: product.thumbnail,
            price: product.price,
            discountPrice: product.discountPrice,
            status: product.status,
            createdAt: product.createdAt.toISOString(),
            updatedAt: product.updatedAt.toISOString()
        };
    }
}
