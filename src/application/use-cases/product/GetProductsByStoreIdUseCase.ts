import { IProductRepository } from "../../../domain/repositories/IProductRepository";
import { ProductResponseDto } from "../../dtos/product/CreateProductDto";

export class GetProductsByStoreIdUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(storeId: string): Promise<ProductResponseDto[]> {
    const products = await this.productRepository.findByStoreId(storeId);
    return products.map((product) => ({
      id: product.id,
      storeId: product.storeId,
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
      store: product.store,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    }));
  }
}
