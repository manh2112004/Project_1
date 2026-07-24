import { IProductImageRepository } from "../../../domain/repositories/IProductImageRepository";

export class DeleteProductImageUseCase {
    constructor(private readonly productImageRepository: IProductImageRepository) { }

    async execute(id: string): Promise<void> {
        // 1. Kiểm tra hình ảnh có tồn tại không
        const productImage = await this.productImageRepository.findById(id);
        if (!productImage) {
            throw new Error(`Hình ảnh với ID '${id}' không tồn tại.`);
        }

        // 2. Xóa khỏi database (bảng product_images xóa cứng)
        await this.productImageRepository.delete(id);
    }
}
