import { Product } from "../../../domain/entities/Product";
import { IProductRepository } from "../../../domain/repositories/IProductRepository";
import { ICategoryRepository } from "../../../domain/repositories/ICategoryRepository";
import { IBrandRepository } from "../../../domain/repositories/IBrandRepository";
import {
  CreateProductDto,
  ProductResponseDto,
} from "../../dtos/product/CreateProductDto";

export class CreateProductUseCase {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly categoryRepository: ICategoryRepository,
    private readonly brandRepository: IBrandRepository,
  ) {}

  async execute(dto: CreateProductDto): Promise<ProductResponseDto> {
    // 1. Kiểm tra danh mục (Category) có tồn tại không
    const category = await this.categoryRepository.findById(dto.categoryId);
    if (!category) {
      throw new Error(`Danh mục với ID '${dto.categoryId}' không tồn tại.`);
    }

    // 2. Kiểm tra thương hiệu (Brand) có tồn tại không
    const brand = await this.brandRepository.findById(dto.brandId);
    if (!brand) {
      throw new Error(`Thương hiệu với ID '${dto.brandId}' không tồn tại.`);
    }

    // 3. Kiểm tra trùng lặp SKU
    const existingSku = await this.productRepository.findBySku(dto.sku);
    if (existingSku) {
      throw new Error(`Mã SKU '${dto.sku.trim().toUpperCase()}' đã tồn tại.`);
    }

    // 4. Tạo và kiểm tra trùng lặp Slug
    const targetSlug =
      dto.slug && dto.slug.trim() !== ""
        ? Product.slugify(dto.slug)
        : Product.slugify(dto.name);
    const existingSlug = await this.productRepository.findBySlug(targetSlug);
    if (existingSlug) {
      throw new Error(`Slug '${targetSlug}' đã tồn tại.`);
    }

    // 5. Tạo Domain Entity
    const product = Product.create({
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

    // 6. Lưu vào Repository
    const savedProduct = await this.productRepository.save(product);

    // 7. Trả về Response DTO
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
