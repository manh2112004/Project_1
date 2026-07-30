import { Request, Response } from "express";
import { CreateRoleUseCase } from "../../application/use-cases/role/CreateRoleUseCase";
import { UpdateRoleUseCase } from "../../application/use-cases/role/UpdateRoleUseCase";
import { DeleteRoleUseCase } from "../../application/use-cases/role/DeleteRoleUseCase";
import { GetRoleByIdUseCase } from "../../application/use-cases/role/GetRoleByIdUseCase";
import { GetAllRoleUseCase } from "../../application/use-cases/role/GetAllRoleUseCase";
import { GetRolePaginationUseCase } from "../../application/use-cases/role/GetRolePaginationUseCase";
import { AssignPermissionToRoleUseCase } from "../../application/use-cases/role/AssignPermissionToRoleUseCase";
import { RevokePermissionFromRoleUseCase } from "../../application/use-cases/role/RevokePermissionFromRoleUseCase";

export class RoleController {
  constructor(
    private readonly createRoleUseCase: CreateRoleUseCase,
    private readonly updateRoleUseCase: UpdateRoleUseCase,
    private readonly deleteRoleUseCase: DeleteRoleUseCase,
    private readonly getRoleByIdUseCase: GetRoleByIdUseCase,
    private readonly getAllRoleUseCase: GetAllRoleUseCase,
    private readonly getRolePaginationUseCase: GetRolePaginationUseCase,
    private readonly assignPermissionToRoleUseCase: AssignPermissionToRoleUseCase,
    private readonly revokePermissionFromRoleUseCase: RevokePermissionFromRoleUseCase,
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, description, code } = req.body;
      const role = await this.createRoleUseCase.execute({ name, description, code });
      res.status(201).json({
        success: true,
        message: "Tạo vai trò thành công",
        data: role,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Lỗi không tạo được vai trò",
      });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, description } = req.body;
      const role = await this.updateRoleUseCase.execute({
        id: String(id),
        name,
        description,
      });
      res.status(200).json({
        success: true,
        message: "Cập nhật vai trò thành công",
        data: role,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Cập nhật vai trò không thành công",
      });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.deleteRoleUseCase.execute(String(id));
      res.status(200).json({
        success: true,
        message: "Xóa vai trò thành công",
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Xóa vai trò không thành công",
      });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const role = await this.getRoleByIdUseCase.execute(String(id));
      res.status(200).json({
        success: true,
        message: "Lấy chi tiết vai trò thành công",
        data: role,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Lấy chi tiết vai trò không thành công",
      });
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const roles = await this.getAllRoleUseCase.execute();
      res.status(200).json({
        success: true,
        message: "Lấy danh sách vai trò thành công",
        data: roles,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Lấy danh sách vai trò không thành công",
      });
    }
  }

  async getPaginated(req: Request, res: Response): Promise<void> {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit
        ? parseInt(req.query.limit as string, 10)
        : 10;
      const search = req.query.search as string | undefined;

      const result = await this.getRolePaginationUseCase.execute(
        page,
        limit,
        search,
      );
      res.status(200).json({
        success: true,
        message: "Lấy danh sách vai trò phân trang thành công",
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Lấy danh sách vai trò phân trang thất bại",
      });
    }
  }

  async assignPermissions(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { permissionCodes } = req.body;
      if (!Array.isArray(permissionCodes)) {
        throw new Error("permissionCodes phải là một mảng chuỗi mã quyền.");
      }

      const result = await this.assignPermissionToRoleUseCase.execute({
        roleId: String(id),
        permissionCodes,
      });

      res.status(200).json({
        success: true,
        message: "Gán quyền cho vai trò thành công",
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Gán quyền không thành công",
      });
    }
  }

  async revokePermissions(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { permissionCodes } = req.body;
      if (!Array.isArray(permissionCodes)) {
        throw new Error("permissionCodes phải là một mảng chuỗi mã quyền.");
      }

      const result = await this.revokePermissionFromRoleUseCase.execute({
        roleId: String(id),
        permissionCodes,
      });

      res.status(200).json({
        success: true,
        message: "Thu hồi quyền từ vai trò thành công",
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Thu hồi quyền không thành công",
      });
    }
  }
}
