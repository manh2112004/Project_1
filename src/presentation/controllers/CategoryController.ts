import { Request, Response } from "express";
import { CreateCategoryUseCase } from "../../application/use-cases/category/CreateCategoryUseCase";
import { UpdateCategoryUseCase } from "../../application/use-cases/category/UpdateCategoryUseCase";
import { DeleteCategoryUseCase } from "../../application/use-cases/category/DeleteCategoryUseCase";
import { GetCategoryByIdUseCase } from "../../application/use-cases/category/GetCategoryByIdUseCase";
import { GetAllCategoryUseCase } from "../../application/use-cases/category/GetAllCategoryUseCase";
import { DomainError } from "../../domain/errors/DomainError";
import { GetCategoriesPaginatedUseCase } from "../../application/use-cases/category/GetCategoriesPaginatedUseCase";
import { HttpResponseMapper } from "../mappers/HttpResponseMapper";

export class CategoryController {
  constructor(
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    private readonly updateCategoryUseCase: UpdateCategoryUseCase,
    private readonly deleteCategoryUseCase: DeleteCategoryUseCase,
    private readonly getCategoryByIdUseCase: GetCategoryByIdUseCase,
    private readonly getAllCategoriesUseCase: GetAllCategoryUseCase,
    private readonly getCategoriesPaginatedUseCase: GetCategoriesPaginatedUseCase,
  ) { }

  async create(req: Request, res: Response): Promise<void> {
    const { name, slug, parentId, description, image, isActive } = req.body;

    const result = await this.createCategoryUseCase.execute({
      name,
      slug,
      parentId,
      description,
      image,
      isActive,
    });

    if (result.isFailure) {
      HttpResponseMapper.sendError(res, result.error);
      return;
    }

    res.status(201).json({
      success: true,
      message: "Tạo danh mục thành công.",
      data: result.value,
    });
  }
  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, slug, parentId, description, image, isActive } = req.body;
      const updateCategory = await this.updateCategoryUseCase.execute({
        id: String(id),
        name,
        slug,
        parentId,
        description,
        image,
        isActive,
      });
      res.status(200).json({
        success: true,
        message: "Cập nhật danh mục thành công",
        data: updateCategory,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Lỗi xử lý cập nhật danh mục",
      });
    }
  }
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.deleteCategoryUseCase.execute(String(id));
      res.status(200).json({
        success: true,
        message: "Xóa danh mục thành công",
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Lỗi xử lý xóa danh mục",
      });
    }
  }
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const category = await this.getCategoryByIdUseCase.execute(String(id));
      res.status(200).json({
        success: true,
        message: "Lấy danh mục thành công",
        data: category,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || "không tìm thấy danh mục",
      });
    }
  }
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const categories = await this.getAllCategoriesUseCase.execute();
      res.status(200).json({
        success: true,
        message: "Lấy danh sách danh mục thành công",
        data: categories,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Lỗi xử lý lấy danh sách danh mục",
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
      // Khởi tạo và thực thi Use Case
      const result = await this.getCategoriesPaginatedUseCase.execute(
        page,
        limit,
        search,
      );

      res.status(200).json({
        success: true,
        message: "Lấy danh sách phân trang danh mục thành công.",
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Lỗi phân trang danh mục.",
      });
    }
  }
}
