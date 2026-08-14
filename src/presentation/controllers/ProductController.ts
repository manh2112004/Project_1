import { Request, Response } from "express";
import { CreateProductUseCase } from "../../application/use-cases/product/CreateProductUseCase";
import { UpdateProductUseCase } from "../../application/use-cases/product/UpdateProductUseCase";
import { DeleteProductUseCase } from "../../application/use-cases/product/DeleteProductUseCase";
import { GetProductByIdUseCase } from "../../application/use-cases/product/GetProductByIdUseCase";
import { GetAllProductUseCase } from "../../application/use-cases/product/GetAllProductUseCase";
import { GetProductsPaginatedUseCase } from "../../application/use-cases/product/GetProductsPaginatedUseCase";
import { GetProductsByStoreIdUseCase } from "../../application/use-cases/product/GetProductsByStoreIdUseCase";
import { GetStoreByUserIdUseCase } from "../../application/use-cases/store/StoreQueryUseCases";
import { sseManager } from "../../infrastructure/services/SseManager";

export class ProductController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
    private readonly getProductByIdUseCase: GetProductByIdUseCase,
    private readonly getAllProductUseCase: GetAllProductUseCase,
    private readonly getProductsPaginatedUseCase: GetProductsPaginatedUseCase,
    private readonly getProductsByStoreIdUseCase?: GetProductsByStoreIdUseCase,
    private readonly getStoreByUserIdUseCase?: GetStoreByUserIdUseCase,
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const {
        storeId,
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
        status,
      } = req.body;

      let targetStoreId = storeId;
      const currentUser = (req as any).user;
      const isAdmin =
        currentUser?.email === "admin@system.com" ||
        currentUser?.roleCode === "SUPER_ADMIN" ||
        currentUser?.roleCode === "ADMIN";

      if (!isAdmin && currentUser && this.getStoreByUserIdUseCase) {
        const store = await this.getStoreByUserIdUseCase.execute(currentUser.id);
        if (!store) {
          res.status(403).json({
            success: false,
            message: "Bạn chưa đăng ký gian hàng nên không thể tạo sản phẩm.",
          });
          return;
        }
        if (store.status !== "ACTIVE") {
          res.status(403).json({
            success: false,
            message: "Gian hàng của bạn chưa được duyệt hoặc đang bị khóa, không thể đăng sản phẩm.",
          });
          return;
        }
        targetStoreId = store.id;
      }

      const product = await this.createProductUseCase.execute({
        storeId: targetStoreId,
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
        status,
      });
      sseManager.sendToAll("product:created", product);
      res.status(201).json({
        success: true,
        message: "Tạo sản phẩm thành công.",
        data: product,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Lỗi xử lý tạo sản phẩm.",
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
        status,
      } = req.body;

      const currentUser = (req as any).user;
      const isAdmin =
        currentUser?.email === "admin@system.com" ||
        currentUser?.roleCode === "SUPER_ADMIN" ||
        currentUser?.roleCode === "ADMIN";

      if (!isAdmin && currentUser && this.getStoreByUserIdUseCase) {
        const store = await this.getStoreByUserIdUseCase.execute(currentUser.id);
        if (!store) {
          res.status(403).json({
            success: false,
            message: "Bạn chưa đăng ký gian hàng nên không thể cập nhật sản phẩm.",
          });
          return;
        }
        if (store.status !== "ACTIVE") {
          res.status(403).json({
            success: false,
            message: "Gian hàng của bạn chưa được duyệt hoặc đang bị khóa.",
          });
          return;
        }
        const existingProduct = await this.getProductByIdUseCase.execute(String(id));
        if (!existingProduct || existingProduct.storeId !== store.id) {
          res.status(403).json({
            success: false,
            message: "Bạn không có quyền cập nhật sản phẩm này.",
          });
          return;
        }
      }

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
        status,
      });

      res.status(200).json({
        success: true,
        message: "Cập nhật sản phẩm thành công.",
        data: product,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Lỗi xử lý cập nhật sản phẩm.",
      });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.deleteProductUseCase.execute(String(id));
      res.status(200).json({
        success: true,
        message: "Xóa sản phẩm thành công.",
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Lỗi xử lý xóa sản phẩm.",
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
        data: product,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Lỗi lấy chi tiết sản phẩm.",
      });
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const search = req.query.search as string | undefined;
      const products = await this.getAllProductUseCase.execute(search);
      res.status(200).json({
        success: true,
        message: "Lấy danh sách sản phẩm thành công.",
        data: products,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Lỗi lấy danh sách sản phẩm.",
      });
    }
  }
  async getPaginated(req: Request, res: Response): Promise<void> {
    try {
      let page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      let limit = req.query.limit
        ? parseInt(req.query.limit as string, 10)
        : 10;
      const search = req.query.search as string | undefined;

      if (isNaN(page) || page <= 0) page = 1;
      if (isNaN(limit) || limit <= 0) limit = 10;

      // Khởi tạo và thực thi Use Case
      const result = await this.getProductsPaginatedUseCase.execute(
        page,
        limit,
        search || "",
      );

      res.status(200).json({
        success: true,
        message: "Lấy danh sách phân trang sản phẩm thành công.",
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Lỗi phân trang sản phẩm.",
      });
    }
  }

  async getByStoreId(req: Request, res: Response): Promise<void> {
    try {
      const storeId = Array.isArray(req.params.storeId) ? req.params.storeId[0] : req.params.storeId;
      if (!this.getProductsByStoreIdUseCase) {
        res.status(500).json({ success: false, message: "GetProductsByStoreIdUseCase chưa được khởi tạo." });
        return;
      }
      const products = await this.getProductsByStoreIdUseCase.execute(storeId);
      res.status(200).json({
        success: true,
        data: products,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Lỗi lấy danh sách sản phẩm theo cửa hàng.",
      });
    }
  }
}
