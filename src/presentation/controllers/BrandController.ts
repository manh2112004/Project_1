import { Request, Response } from "express";
import { CreateBrandUseCase } from "../../application/use-cases/brand/CreateBrandUseCase";
import { UpdateBrandUseCase } from "../../application/use-cases/brand/UpdateBrandUseCase";
import { DeleteBrandUseCase } from "../../application/use-cases/brand/DeleteBrandUseCase";
import { GetBrandByIdUseCase } from "../../application/use-cases/brand/GetBrandByIdUseCase";
import { GetAllBrandUseCase } from "../../application/use-cases/brand/GetAllBrandUseCase";
import { GetBrandsPaginatedUseCase } from "../../application/use-cases/brand/GetBrandPaginationUseCase";
import { HttpResponseMapper } from "../mappers/HttpResponseMapper";

export class BrandController {
  constructor(
    private readonly createBrandUseCase: CreateBrandUseCase,
    private readonly updateBrandUseCase: UpdateBrandUseCase,
    private readonly deleteBrandUseCase: DeleteBrandUseCase,
    private readonly getBrandByIdUseCase: GetBrandByIdUseCase,
    private readonly getAllBrandUseCase: GetAllBrandUseCase,
    private readonly getBrandPaginationUseCase: GetBrandsPaginatedUseCase,
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    const { name, logo, description, isActive } = req.body;
    const result = await this.createBrandUseCase.execute({
      name,
      logo,
      description,
      isActive,
    });

    if (result.isFailure) {
      HttpResponseMapper.sendError(res, result.error);
      return;
    }

    res.status(201).json({
      success: true,
      message: "Tạo thương hiệu thành công.",
      data: result.value,
    });
  }

  async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { name, description, logo, isActive } = req.body;
    const result = await this.updateBrandUseCase.execute({
      id: String(id),
      name,
      description,
      logo,
      isActive,
    });

    if (result.isFailure) {
      HttpResponseMapper.sendError(res, result.error);
      return;
    }

    res.status(200).json({
      success: true,
      message: "Cập nhật thương hiệu thành công.",
      data: result.value,
    });
  }

  async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const result = await this.deleteBrandUseCase.execute(String(id));

    if (result.isFailure) {
      HttpResponseMapper.sendError(res, result.error);
      return;
    }

    res.status(200).json({
      success: true,
      message: "Xóa thương hiệu thành công.",
    });
  }

  async getById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const result = await this.getBrandByIdUseCase.execute(String(id));

    if (result.isFailure) {
      HttpResponseMapper.sendError(res, result.error);
      return;
    }

    res.status(200).json({
      success: true,
      message: "Lấy thương hiệu thành công.",
      data: result.value,
    });
  }

  async getAll(req: Request, res: Response): Promise<void> {
    const result = await this.getAllBrandUseCase.execute();

    if (result.isFailure) {
      HttpResponseMapper.sendError(res, result.error);
      return;
    }

    res.status(200).json({
      success: true,
      message: "Lấy danh sách thương hiệu thành công.",
      data: result.value,
    });
  }

  async getPaginated(req: Request, res: Response): Promise<void> {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit
      ? parseInt(req.query.limit as string, 10)
      : 10;
    const search = req.query.search as string | undefined;

    const result = await this.getBrandPaginationUseCase.execute(
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
      message: "Lấy danh sách thương hiệu thành công.",
      data: result.value,
    });
  }
}
