import { Request, Response } from "express";
import { CreateProductImageUseCase } from "../../application/use-cases/product-image/CreateProductImageUseCase";
import { DeleteProductImageUseCase } from "../../application/use-cases/product-image/DeleteProductImageUseCase";
import { CloudinaryService } from "../../infrastructure/services/CloudinaryService";
import { Multer } from "multer";
import { getAllProductImageUseCase } from "../../application/use-cases/product-image/getAllProductImageUseCase";
export class ProductImageController {
    constructor(
        private readonly createProductImageUseCase: CreateProductImageUseCase,
        private readonly deleteProductImageUseCase: DeleteProductImageUseCase,
        private readonly getAllProductImageUseCase: getAllProductImageUseCase,
        private readonly cloudinaryService: CloudinaryService
    ) { }

    async create(req: Request, res: Response): Promise<void> {
        try {
            // 1. Kiểm tra xem Multer có nhận được danh sách file ảnh không
            const files = req.files as Express.Multer.File[];
            if (!files || files.length === 0) {
                throw new Error("Không tìm thấy file ảnh tải lên.");
            }

            // 2. Lấy và ép kiểu dữ liệu từ req.body (vì form-data gửi lên đều là string)
            const { productId, isThumbnail, sortOrder } = req.body;

            const parsedIsThumbnail = isThumbnail === "true"; // chuyển string "true"/"false" sang boolean
            const baseSortOrder = sortOrder ? parseInt(sortOrder, 10) : 0; // chuyển string sang number

            // 3. Upload từng file ảnh lên Cloudinary và gọi Use Case lưu vào database
            const productImages = await Promise.all(
                files.map(async (file, index) => {
                    const imageUrl = await this.cloudinaryService.uploadImage(file.buffer);
                    return this.createProductImageUseCase.execute({
                        productId,
                        imageUrl,
                        isThumbnail: parsedIsThumbnail,
                        sortOrder: baseSortOrder + index
                    });
                })
            );

            res.status(201).json({
                success: true,
                message: "Tải các ảnh sản phẩm và lưu thành công.",
                data: productImages
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
    async getAll(req:Request,res:Response):Promise<void>{
        try{
            const images = await this.getAllProductImageUseCase.execute();
            res.status(200).json({
                success:true,
                message:"Lấy danh sách hình ảnh thành công",
                data:images
            })
        }catch(error:any){
            res.status(400).json({
                success:false,
                message:error.message||"Lấy danh sách hình ảnh không thành công",
            })
        }
    }
}
