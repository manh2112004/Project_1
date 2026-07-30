import { Request, Response } from "express";
import { CreatePermissionUseCase } from "../../application/use-cases/permission/CreatePermissionUseCase";
import { GetPermissionByIdUseCase } from "../../application/use-cases/permission/GetPermissionByIdUseCase";
import { GetAllPermissionUseCase } from "../../application/use-cases/permission/GetAllPermissionUseCase";
import { GetPermissionPaginationUseCase } from "../../application/use-cases/permission/GetPermissionPaginationUseCase";

export class PermissionController {
  constructor(
    private readonly createPermissionUseCase: CreatePermissionUseCase,
    private readonly getPermissionByIdUseCase: GetPermissionByIdUseCase,
    private readonly getAllPermissionUseCase: GetAllPermissionUseCase,
    private readonly getPermissionPaginationUseCase: GetPermissionPaginationUseCase,
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, module, description } = req.body;
      const permission = await this.createPermissionUseCase.execute({
        name,
        module,
        description,
      });

      res.status(201).json({
        success: true,
        message: "Tạo quyền hạn thành công",
        data: permission,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Lỗi không tạo được quyền hạn",
      });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const permission = await this.getPermissionByIdUseCase.execute(String(id));

      res.status(200).json({
        success: true,
        message: "Lấy chi tiết quyền hạn thành công",
        data: permission,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Lấy chi tiết quyền hạn không thành công",
      });
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const permissions = await this.getAllPermissionUseCase.execute();

      res.status(200).json({
        success: true,
        message: "Lấy danh sách quyền hạn thành công",
        data: permissions,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Lấy danh sách quyền hạn không thành công",
      });
    }
  }

  async getPaginated(req: Request, res: Response): Promise<void> {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
      const search = req.query.search as string | undefined;

      const result = await this.getPermissionPaginationUseCase.execute(page, limit, search);

      res.status(200).json({
        success: true,
        message: "Lấy danh sách quyền hạn phân trang thành công",
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Lấy danh sách quyền hạn phân trang thất bại",
      });
    }
  }
}
