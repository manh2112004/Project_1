import { Request, Response } from "express";
import { CreateProductUseCase } from "../../application/use-cases/product/CreateProductUseCase";
import { UpdateProductUseCase } from "../../application/use-cases/product/UpdateProductUseCase";
import { DeleteProductUseCase } from "../../application/use-cases/product/DeleteProductUseCase";
import { GetProductByIdUseCase } from "../../application/use-cases/product/GetProductByIdUseCase";
import { GetAllProductUseCase } from "../../application/use-cases/product/GetAllProductUseCase";
import { GetProductsPaginatedUseCase } from "../../application/use-cases/product/GetProductsPaginatedUseCase";

export class ProductController {
    constructor(
        private readonly createProductUseCase: CreateProductUseCase,
        private readonly updateProductUseCase: UpdateProductUseCase,
        private readonly deleteProductUseCase: DeleteProductUseCase,
        private readonly getProductByIdUseCase: GetProductByIdUseCase,
        private readonly getAllProductUseCase: GetAllProductUseCase,
        private readonly getProductsPaginatedUseCase:GetProductsPaginatedUseCase
    ) { }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const {
                categoryId,
                brandId,
                name,
                slug,
                sku,
                shortDescription,
                description,
                thumbnail,
                price,
                discountPrice,
                status
            } = req.body;

            const product = await this.createProductUseCase.execute({
                categoryId,
                brandId,
                name,
                slug,
                sku,
                shortDescription,
                description,
                thumbnail,
                price,
                discountPrice,
                status
            });

            res.status(201).json({
                success: true,
                message: "Tạo sản phẩm thành công.",
                data: product
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message || "Lỗi xử lý tạo sản phẩm."
            });
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const {
                categoryId,
                brandId,
                name,
                slug,
                sku,
                shortDescription,
                description,
                thumbnail,
                price,
                discountPrice,
                status
            } = req.body;

            const product = await this.updateProductUseCase.execute({
                id: String(id),
                categoryId,
                brandId,
                name,
                slug,
                sku,
                shortDescription,
                description,
                thumbnail,
                price,
                discountPrice,
                status
            });

            res.status(200).json({
                success: true,
                message: "Cập nhật sản phẩm thành công.",
                data: product
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message || "Lỗi xử lý cập nhật sản phẩm."
            });
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            await this.deleteProductUseCase.execute(String(id));
            res.status(200).json({
                success: true,
                message: "Xóa sản phẩm thành công."
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message || "Lỗi xử lý xóa sản phẩm."
            });
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const product = await this.getProductByIdUseCase.execute(String(id));
            res.status(200).json({
                success: true,
                message: "Lấy chi tiết sản phẩm thành công.",
                data: product
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message || "Lỗi lấy chi tiết sản phẩm."
            });
        }
    }

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const products = await this.getAllProductUseCase.execute();
            res.status(200).json({
                success: true,
                message: "Lấy danh sách sản phẩm thành công.",
                data: products
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message || "Lỗi lấy danh sách sản phẩm."
            });
        }
    }
    async getPaginated(req: Request, res: Response): Promise<void> {
        try {
            const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;

            // Khởi tạo và thực thi Use Case
            const result = await this.getProductsPaginatedUseCase.execute(page, limit);

            res.status(200).json({
                success: true,
                message: "Lấy danh sách phân trang sản phẩm thành công.",
                data: result
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message || "Lỗi phân trang sản phẩm."
            });
        }
    }

}
