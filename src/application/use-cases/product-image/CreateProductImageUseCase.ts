import { ProductImage } from "../../../domain/entities/ProductImage";
import { IProductImageRepository } from "../../../domain/repositories/IProductImageRepository";
import { IProductRepository } from "../../../domain/repositories/IProductRepository";
import { CreateProductImageDto, ProductImageResponseDto } from "../../dtos/product-image/CreateProductImageDto";

export class CreateProductImageUseCase {
    constructor(
        private readonly productImageRepository: IProductImageRepository,
        private readonly productRepository: IProductRepository
    ) { }

    async execute(dto: CreateProductImageDto): Promise<ProductImageResponseDto> {
        // 1. Kiểm tra sản phẩm có tồn tại không
        const product = await this.productRepository.findById(dto.productId);
        if (!product) {
            throw new Error(`Sản phẩm với ID '${dto.productId}' không tồn tại.`);
        }

        // 2. Tạo thực thể hình ảnh sản phẩm
        const productImage = ProductImage.create({
            productId: dto.productId,
            imageUrl: dto.imageUrl,
            isThumbnail: dto.isThumbnail,
            sortOrder: dto.sortOrder,
        });

        // 3. Lưu vào database
        const savedImage = await this.productImageRepository.save(productImage);

        // 4. Trả về Response DTO
        return {
            id: savedImage.id,
            productId: savedImage.productId,
            imageUrl: savedImage.imageUrl,
            isThumbnail: savedImage.isThumbnail,
            sortOrder: savedImage.sortOrder,
            createdAt: savedImage.createdAt.toISOString(),
        };
    }
}
