import { Request, Response } from "express";
import { CreateInventoryUseCase } from "../../application/use-cases/inventory/CreateInventoryUseCase";
import { UpdateInventoryUseCase } from "../../application/use-cases/inventory/UpdateInventoryUseCase";
import { DeleteInventoryUseCase } from "../../application/use-cases/inventory/DeleteInventoryUseCase";
import { GetInventoryByIdUseCase } from "../../application/use-cases/inventory/GetInventoryByIdUseCase";
import { GetAllInventoryUseCase } from "../../application/use-cases/inventory/GetAllInventoryUseCase";

export class InventoryController {
    constructor(
        private readonly createInventoryUseCase: CreateInventoryUseCase,
        private readonly updateInventoryUseCase: UpdateInventoryUseCase,
        private readonly deleteInventoryUseCase: DeleteInventoryUseCase,
        private readonly getInventoryByIdUseCase: GetInventoryByIdUseCase,
        private readonly getAllInventoryUseCase: GetAllInventoryUseCase
    ) { }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const { productId, quantity, importPrice } = req.body;
            const inventory = await this.createInventoryUseCase.execute({
                productId,
                quantity,
                importPrice
            });

            res.status(201).json({
                success: true,
                message: "Tạo bản ghi tồn kho thành công.",
                data: inventory
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message || "Lỗi xử lý tạo bản ghi tồn kho."
            });
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { quantity, importPrice } = req.body;

            const inventory = await this.updateInventoryUseCase.execute({
                id: String(id),
                quantity,
                importPrice
            });

            res.status(200).json({
                success: true,
                message: "Cập nhật tồn kho thành công.",
                data: inventory
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message || "Lỗi xử lý cập nhật tồn kho."
            });
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            await this.deleteInventoryUseCase.execute(String(id));
            res.status(200).json({
                success: true,
                message: "Xóa bản ghi tồn kho thành công."
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message || "Lỗi xử lý xóa bản ghi tồn kho."
            });
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const inventory = await this.getInventoryByIdUseCase.execute(String(id));
            res.status(200).json({
                success: true,
                message: "Lấy chi tiết tồn kho thành công.",
                data: inventory
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message || "Lỗi lấy chi tiết tồn kho."
            });
        }
    }

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const inventories = await this.getAllInventoryUseCase.execute();
            res.status(200).json({
                success: true,
                message: "Lấy danh sách tồn kho thành công.",
                data: inventories
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message || "Lỗi lấy danh sách tồn kho."
            });
        }
    }
}
