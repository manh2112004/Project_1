import { Product } from "../../../domain/entities/Product";
import { IProductRepository } from "../../../domain/repositories/IProductRepository";
import { ICategoryRepository } from "../../../domain/repositories/ICategoryRepository";
import { IBrandRepository } from "../../../domain/repositories/IBrandRepository";
import { CreateProductDto, ProductResponseDto } from "../../dtos/product/CreateProductDto";
import { Result, ok, fail } from "../../../domain/common/Result";
import { DomainError } from "../../../domain/errors/DomainError";
import { CategoryNotFoundError } from "../../../domain/errors/category/CategoryNotFoundError";
import { BrandNotFoundError } from "../../../domain/errors/Brand/BrandNotFoundError";
import { DuplicateSkuError } from "../../../domain/errors/product/DuplicateSkuError";
import { DuplicateProductSlugError } from "../../../domain/errors/product/DuplicateProductSlugError";

export class CreateProductUseCase {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly categoryRepository: ICategoryRepository,
    private readonly brandRepository: IBrandRepository,
  ) {}

  async execute(dto: CreateProductDto): Promise<Result<ProductResponseDto, DomainError>> {
    // 1. Tạo Domain Entity (Domain tự validate các quy tắc bất biến & trả về Result)
    const productResult = Product.create({
      storeId: dto.storeId,
      categoryId: dto.categoryId,
      brandId: dto.brandId,
      name: dto.name,
      slug: dto.slug,
      sku: dto.sku,
      shortDescription: dto.shortDescription,
      description: dto.description,
      thumbnail: dto.thumbnail,
      price: dto.price,
      discountPrice: dto.discountPrice,
      status: dto.status,
    });

    if (productResult.isFailure) {
      return fail(productResult.error);
    }

    const product = productResult.value;

    // 2. Kiểm tra danh mục (Category) có tồn tại không
    const category = await this.categoryRepository.findById(product.categoryId);
    if (!category) {
      return fail(new CategoryNotFoundError(product.categoryId));
    }

    // 3. Kiểm tra thương hiệu (Brand) có tồn tại không
    const brand = await this.brandRepository.findById(product.brandId);
    if (!brand) {
      return fail(new BrandNotFoundError(product.brandId));
    }

    // 4. Kiểm tra trùng lặp SKU
    const existingSku = await this.productRepository.findBySku(product.sku);
    if (existingSku) {
      return fail(new DuplicateSkuError(product.sku));
    }

    // 5. Kiểm tra trùng lặp Slug
    const existingSlug = await this.productRepository.findBySlug(product.slug);
    if (existingSlug) {
      return fail(new DuplicateProductSlugError(product.slug));
    }

    // 6. Lưu vào Repository
    const savedProduct = await this.productRepository.save(product);

    // 7. Trả về Response DTO dạng ok()
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
      store: savedProduct.store,
      createdAt: savedProduct.createdAt.toISOString(),
      updatedAt: savedProduct.updatedAt.toISOString(),
    });
  }
}

