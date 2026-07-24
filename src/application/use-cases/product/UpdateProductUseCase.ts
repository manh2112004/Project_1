import { Product } from "../../../domain/entities/Product";
import { IProductRepository } from "../../../domain/repositories/IProductRepository";
import { ICategoryRepository } from "../../../domain/repositories/ICategoryRepository";
import { IBrandRepository } from "../../../domain/repositories/IBrandRepository";
import { UpdateProductDto, UpdateProductResponse } from "../../dtos/product/UpdateProductDto";

export class UpdateProductUseCase {
    constructor(
        private readonly productRepository: IProductRepository,
        private readonly categoryRepository: ICategoryRepository,
        private readonly brandRepository: IBrandRepository
    ) { }

    async execute(dto: UpdateProductDto): Promise<UpdateProductResponse> {
        // 1. Tìm sản phẩm hiện tại
        const product = await this.productRepository.findById(dto.id);
        if (!product) {
            throw new Error(`Sản phẩm với ID '${dto.id}' không tồn tại.`);
        }

        // 2. Nếu cập nhật Danh mục (Category), kiểm tra sự tồn tại
        if (dto.categoryId !== undefined) {
            const category = await this.categoryRepository.findById(dto.categoryId);
            if (!category) {
                throw new Error(`Danh mục với ID '${dto.categoryId}' không tồn tại.`);
            }
        }

        // 3. Nếu cập nhật Thương hiệu (Brand), kiểm tra sự tồn tại
        if (dto.brandId !== undefined) {
            const brand = await this.brandRepository.findById(dto.brandId);
            if (!brand) {
                throw new Error(`Thương hiệu với ID '${dto.brandId}' không tồn tại.`);
            }
        }

        // 4. Nếu cập nhật SKU, kiểm tra trùng lặp với sản phẩm khác
        if (dto.sku !== undefined) {
            const normalizedSku = dto.sku.trim().toUpperCase();
            if (normalizedSku !== product.sku) {
                const existingSku = await this.productRepository.findBySku(normalizedSku);
                if (existingSku && existingSku.id !== product.id) {
                    throw new Error(`Mã SKU '${normalizedSku}' đã được sử dụng.`);
                }
            }
        }

        // 5. Tính toán và kiểm tra trùng lặp Slug
        let targetSlug = product.slug;
        if (dto.name !== undefined) {
            targetSlug = dto.slug && dto.slug.trim() !== ""
                ? Product.slugify(dto.slug)
                : Product.slugify(dto.name);
        } else if (dto.slug !== undefined && dto.slug.trim() !== "") {
            targetSlug = Product.slugify(dto.slug);
        }

        if (targetSlug !== product.slug) {
            const existingSlug = await this.productRepository.findBySlug(targetSlug);
            if (existingSlug && existingSlug.id !== product.id) {
                throw new Error(`Slug '${targetSlug}' đã được sử dụng.`);
            }
        }

        // 6. Cập nhật trạng thái thực thể Domain
        product.update({
            id: dto.id,
            categoryId: dto.categoryId,
            brandId: dto.brandId,
            name: dto.name,
            slug: targetSlug,
            sku: dto.sku,
            shortDescription: dto.shortDescription,
            description: dto.description,
            thumbnail: dto.thumbnail,
            price: dto.price,
            discountPrice: dto.discountPrice,
            status: dto.status,
        });

        // 7. Lưu xuống DB
        const savedProduct = await this.productRepository.save(product);

        // 8. Trả về Response DTO
        return {
            id: savedProduct.id,
            categoryId: savedProduct.categoryId,
            brandId: savedProduct.brandId,
            name: savedProduct.name,
            slug: savedProduct.slug,
            sku: savedProduct.sku,
            shortDescription: savedProduct.shortDescription,
            description: savedProduct.description,
            thumbnail: savedProduct.thumbnail,
            price: savedProduct.price,
            discountPrice: savedProduct.discountPrice,
            status: savedProduct.status,
            createdAt: savedProduct.createdAt.toISOString(),
            updatedAt: savedProduct.updatedAt.toISOString(),
        };
    }
}
