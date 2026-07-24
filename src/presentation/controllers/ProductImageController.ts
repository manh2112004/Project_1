import { Request, Response } from "express";
import { CreateProductImageUseCase } from "../../application/use-cases/product-image/CreateProductImageUseCase";
import { DeleteProductImageUseCase } from "../../application/use-cases/product-image/DeleteProductImageUseCase";
import { CloudinaryService } from "../../infrastructure/services/CloudinaryService";
import { Multer } from "multer";
export class ProductImageController {
    constructor(
        private readonly createProductImageUseCase: CreateProductImageUseCase,
        private readonly deleteProductImageUseCase: DeleteProductImageUseCase,
        private readonly cloudinaryService: CloudinaryService
    ) { }

    async create(req: Request, res: Response): Promise<void> {
        try {
            // 1. Kiểm tra xem Multer có nhận được file ảnh không
            if (!req.file) {
                throw new Error("Không tìm thấy file ảnh tải lên.");
            }

            // 2. Upload file ảnh (dạng Buffer) lên Cloudinary và lấy URL bảo mật
            const imageUrl = await this.cloudinaryService.uploadImage(req.file.buffer);

            // 3. Lấy và ép kiểu dữ liệu từ req.body (vì form-data gửi lên đều là string)
            const { productId, isThumbnail, sortOrder } = req.body;
            
            const parsedIsThumbnail = isThumbnail === "true"; // chuyển string "true"/"false" sang boolean
            const parsedSortOrder = sortOrder ? parseInt(sortOrder, 10) : undefined; // chuyển string sang number

            // 4. Gọi Use Case để lưu vào database
            const productImage = await this.createProductImageUseCase.execute({
                productId,
                imageUrl,
                isThumbnail: parsedIsThumbnail,
                sortOrder: parsedSortOrder
            });

            res.status(201).json({
                success: true,
                message: "Tải ảnh sản phẩm và lưu thành công.",
                data: productImage
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message || "Lỗi xử lý tải ảnh sản phẩm."
            });
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            
            // Gọi Use Case để xóa ảnh trong DB
            await this.deleteProductImageUseCase.execute(String(id));

            res.status(200).json({
                success: true,
                message: "Xóa hình ảnh sản phẩm thành công."
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message || "Lỗi xử lý xóa hình ảnh sản phẩm."
            });
        }
    }
}
