import { Product } from "../../../domain/entities/Product";
import { IProductRepository } from "../../../domain/repositories/IProductRepository";
import { ICategoryRepository } from "../../../domain/repositories/ICategoryRepository";
import { IBrandRepository } from "../../../domain/repositories/IBrandRepository";
import { UpdateProductDto, UpdateProductResponse } from "../../dtos/product/UpdateProductDto";
import { Result, ok, fail } from "../../../domain/common/Result";
import { DomainError } from "../../../domain/errors/DomainError";
import { ProductNotFoundError } from "../../../domain/errors/product/ProductNotFoundError";
import { CategoryNotFoundError } from "../../../domain/errors/category/CategoryNotFoundError";
import { BrandNotFoundError } from "../../../domain/errors/Brand/BrandNotFoundError";
import { DuplicateSkuError } from "../../../domain/errors/product/DuplicateSkuError";
import { DuplicateProductSlugError } from "../../../domain/errors/product/DuplicateProductSlugError";

export class UpdateProductUseCase {
    constructor(
        private readonly productRepository: IProductRepository,
        private readonly categoryRepository: ICategoryRepository,
        private readonly brandRepository: IBrandRepository
    ) { }

    async execute(dto: UpdateProductDto): Promise<Result<UpdateProductResponse, DomainError>> {
        // 1. Tìm sản phẩm hiện tại
        const product = await this.productRepository.findById(dto.id);
        if (!product) {
            return fail(new ProductNotFoundError(dto.id));
        }

        // 2. Nếu cập nhật Danh mục (Category), kiểm tra sự tồn tại
        if (dto.categoryId !== undefined) {
            const category = await this.categoryRepository.findById(dto.categoryId);
            if (!category) {
                return fail(new CategoryNotFoundError(dto.categoryId));
            }
        }

        // 3. Nếu cập nhật Thương hiệu (Brand), kiểm tra sự tồn tại
        if (dto.brandId !== undefined) {
            const brand = await this.brandRepository.findById(dto.brandId);
            if (!brand) {
                return fail(new BrandNotFoundError(dto.brandId));
            }
        }

        // 4. Nếu cập nhật SKU, kiểm tra trùng lặp với sản phẩm khác
        if (dto.sku !== undefined) {
            const normalizedSku = dto.sku.trim().toUpperCase();
            if (normalizedSku !== product.sku) {
                const existingSku = await this.productRepository.findBySku(normalizedSku);
                if (existingSku && existingSku.id !== product.id) {
                    return fail(new DuplicateSkuError(normalizedSku));
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
                return fail(new DuplicateProductSlugError(targetSlug));
            }
        }

        // 6. Cập nhật trạng thái thực thể Domain (Domain tự validate quy tắc bất biến & trả về Result)
        const updateResult = product.update({
            id: dto.id,
            storeId: dto.storeId,
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

        if (updateResult.isFailure) {
            return fail(updateResult.error);
        }

        // 7. Lưu xuống DB
        const savedProduct = await this.productRepository.save(product);

        // 8. Trả về Response DTO dạng ok()
        return ok({
            id: savedProduct.id,
            storeId: savedProduct.storeId,
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
        });
    }
}

