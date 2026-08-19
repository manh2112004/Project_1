import { Request, Response } from "express";
import { CreateCategoryUseCase } from "../../application/use-cases/category/CreateCategoryUseCase";
import { UpdateCategoryUseCase } from "../../application/use-cases/category/UpdateCategoryUseCase";
import { DeleteCategoryUseCase } from "../../application/use-cases/category/DeleteCategoryUseCase";
import { GetCategoryByIdUseCase } from "../../application/use-cases/category/GetCategoryByIdUseCase";
import { GetAllCategoryUseCase } from "../../application/use-cases/category/GetAllCategoryUseCase";
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
  ) {}

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
    const { id } = req.params;
    const { name, slug, parentId, description, image, isActive } = req.body;

    const result = await this.updateCategoryUseCase.execute({
      id: String(id),
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

    res.status(200).json({
      success: true,
      message: "Cập nhật danh mục thành công.",
      data: result.value,
    });
  }

  async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const result = await this.deleteCategoryUseCase.execute(String(id));

    if (result.isFailure) {
      HttpResponseMapper.sendError(res, result.error);
      return;
    }

    res.status(200).json({
      success: true,
      message: "Xóa danh mục thành công.",
    });
  }

  async getById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const result = await this.getCategoryByIdUseCase.execute(String(id));

    if (result.isFailure) {
      HttpResponseMapper.sendError(res, result.error);
      return;
    }

    res.status(200).json({
      success: true,
      message: "Lấy danh mục thành công.",
      data: result.value,
    });
  }

  async getAll(req: Request, res: Response): Promise<void> {
    const result = await this.getAllCategoriesUseCase.execute();

    if (result.isFailure) {
      HttpResponseMapper.sendError(res, result.error);
      return;
    }

    res.status(200).json({
      success: true,
      message: "Lấy danh sách danh mục thành công.",
      data: result.value,
    });
  }

  async getPaginated(req: Request, res: Response): Promise<void> {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit
      ? parseInt(req.query.limit as string, 10)
      : 10;
    const search = req.query.search as string | undefined;

    const result = await this.getCategoriesPaginatedUseCase.execute(
      page,
      limit,
      search,
    );

    if (result.isFailure) {
      HttpResponseMapper.sendError(res, result.error);
      return;
    }

    res.status(200).json({
      success: true,
      message: "Lấy danh sách phân trang danh mục thành công.",
      data: result.value,
    });
  }
}
