import { IProductRepository } from "../../../domain/repositories/IProductRepository";
import { ProductResponseDto } from "../../dtos/product/CreateProductDto";

export class GetAllProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(search?: string): Promise<ProductResponseDto[]> {
    const products = await this.productRepository.searchByNameOrSlug(search);

    return products.map((product) => ({
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
      updatedAt: product.updatedAt.toISOString(),
    }));
  }
}
