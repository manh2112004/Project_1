import { IProductRepository } from "../../../domain/repositories/IProductRepository";
import { ProductResponseDto } from "../../dtos/product/CreateProductDto";
export interface PaginatedProductsResponse {
    products: ProductResponseDto[],
    meta: {
        totalCount: number,
        totalPages: number,
        currentPage: number,
        limit: number
    }
}
export class GetProductsPaginatedUseCase {
    constructor(private readonly productRepository: IProductRepository) { }
    async execute(page: number, limit: number): Promise<PaginatedProductsResponse> {
        const validPage = page > 0 ? page : 1;
        const validLimit = limit > 0 ? limit : 1
        const { products, totalCount } = await this.productRepository.findAndCount(validPage, validLimit);
        const totalPages = Math.ceil(totalCount / validLimit);
        return {
            products: products.map(product => ({
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
            })),
            meta:{
                totalCount,
                totalPages,
                currentPage: validPage,
                limit: validLimit
            }
        }
    }
}