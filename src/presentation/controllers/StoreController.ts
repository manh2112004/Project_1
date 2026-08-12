import { Request, Response } from "express";
import { RegisterStoreUseCase } from "../../application/use-cases/store/RegisterStoreUseCase";
import {
  GetStoreByIdUseCase,
  GetStoreByUserIdUseCase,
  GetStoresPaginatedUseCase,
} from "../../application/use-cases/store/StoreQueryUseCases";
import {
  UpdateStoreProfileUseCase,
  ApproveStoreUseCase,
  SuspendStoreUseCase,
  RejectStoreUseCase,
  ReactivateStoreUseCase,
  ToggleVacationModeUseCase,
  UpdateStoreLegalInfoUseCase,
} from "../../application/use-cases/store/ManageStoreUseCases";
import { StoreMapper } from "../../application/mappers/StoreMapper";

export class StoreController {
  constructor(
    private readonly registerStoreUseCase: RegisterStoreUseCase,
    private readonly getStoreByIdUseCase: GetStoreByIdUseCase,
    private readonly getStoreByUserIdUseCase: GetStoreByUserIdUseCase,
    private readonly getStoresPaginatedUseCase: GetStoresPaginatedUseCase,
    private readonly updateStoreProfileUseCase: UpdateStoreProfileUseCase,
    private readonly approveStoreUseCase: ApproveStoreUseCase,
    private readonly suspendStoreUseCase: SuspendStoreUseCase,
    private readonly rejectStoreUseCase: RejectStoreUseCase,
    private readonly reactivateStoreUseCase: ReactivateStoreUseCase,
    private readonly toggleVacationModeUseCase: ToggleVacationModeUseCase,
    private readonly updateStoreLegalInfoUseCase: UpdateStoreLegalInfoUseCase
  ) {}

  async register(req: Request, res: Response): Promise<void> {
    try {
      const currentUser = (req as any).user;
      const store = await this.registerStoreUseCase.execute({
        userId: currentUser.id,
        ...req.body,
      });

      res.status(201).json({
        success: true,
        message: "Đăng ký cửa hàng mới thành công. Cửa hàng đang chờ được duyệt.",
        data: StoreMapper.toResponse(store),
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Đăng ký cửa hàng thất bại.",
      });
    }
  }

  async getMyStore(req: Request, res: Response): Promise<void> {
    try {
      const currentUser = (req as any).user;
      const store = await this.getStoreByUserIdUseCase.execute(currentUser.id);
      if (!store) {
        res.status(404).json({
          success: false,
          message: "Người dùng chưa đăng ký cửa hàng nào.",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: StoreMapper.toResponse(store),
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Lấy thông tin cửa hàng thất bại.",
      });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const store = await this.getStoreByIdUseCase.execute(id);

      res.status(200).json({
        success: true,
        data: StoreMapper.toResponse(store),
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || "Không tìm thấy cửa hàng.",
      });
    }
  }

  async getPaginated(req: Request, res: Response): Promise<void> {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
      const search = req.query.search as string | undefined;
      const status = req.query.status as any;

      const { stores, totalCount } = await this.getStoresPaginatedUseCase.execute({
        page,
        limit,
        search,
        status,
      });

      const totalPages = Math.ceil(totalCount / limit);

      res.status(200).json({
        success: true,
        data: {
          items: StoreMapper.toResponseList(stores),
          meta: {
            total: totalCount,
            page,
            limit,
            totalPages,
          },
        },
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Lấy danh sách cửa hàng thất bại.",
      });
    }
  }

  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const currentUser = (req as any).user;
      const myStore = await this.getStoreByUserIdUseCase.execute(currentUser.id);
      if (!myStore) {
        res.status(404).json({
          success: false,
          message: "Bạn chưa đăng ký cửa hàng nào.",
        });
        return;
      }

      const updated = await this.updateStoreProfileUseCase.execute(myStore.id, req.body);
      res.status(200).json({
        success: true,
        message: "Cập nhật hồ sơ cửa hàng thành công.",
        data: StoreMapper.toResponse(updated),
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Cập nhật hồ sơ cửa hàng thất bại.",
      });
    }
  }

  async updateLegalInfo(req: Request, res: Response): Promise<void> {
    try {
      const currentUser = (req as any).user;
      const myStore = await this.getStoreByUserIdUseCase.execute(currentUser.id);
      if (!myStore) {
        res.status(404).json({
          success: false,
          message: "Bạn chưa đăng ký cửa hàng nào.",
        });
        return;
      }

      const updated = await this.updateStoreLegalInfoUseCase.execute(myStore.id, req.body);
      res.status(200).json({
        success: true,
        message: "Cập nhật thông tin pháp lý thành công. Cửa hàng chuyển về trạng thái chờ duyệt lại.",
        data: StoreMapper.toResponse(updated),
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Cập nhật giấy tờ pháp lý thất bại.",
      });
    }
  }

  async toggleVacation(req: Request, res: Response): Promise<void> {
    try {
      const currentUser = (req as any).user;
      const myStore = await this.getStoreByUserIdUseCase.execute(currentUser.id);
      if (!myStore) {
        res.status(404).json({
          success: false,
          message: "Bạn chưa đăng ký cửa hàng nào.",
        });
        return;
      }

      const { isOnVacation } = req.body;
      const updated = await this.toggleVacationModeUseCase.execute(myStore.id, Boolean(isOnVacation));

      res.status(200).json({
        success: true,
        message: isOnVacation ? "Đã bật chế độ tạm nghỉ bán." : "Đã mở lại hoạt động bán hàng.",
        data: StoreMapper.toResponse(updated),
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Thay đổi chế độ tạm nghỉ thất bại.",
      });
    }
  }

  async approve(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const store = await this.approveStoreUseCase.execute(id);

      res.status(200).json({
        success: true,
        message: "Phê duyệt cửa hàng thành công.",
        data: StoreMapper.toResponse(store),
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Duyệt cửa hàng thất bại.",
      });
    }
  }

  async suspend(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const { reason } = req.body;
      const store = await this.suspendStoreUseCase.execute(id, { reason });

      res.status(200).json({
        success: true,
        message: "Khóa cửa hàng thành công.",
        data: StoreMapper.toResponse(store),
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Khóa cửa hàng thất bại.",
      });
    }
  }

  async reject(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const { reason } = req.body;
      const store = await this.rejectStoreUseCase.execute(id, { reason });

      res.status(200).json({
        success: true,
        message: "Từ chối duyệt cửa hàng thành công.",
        data: StoreMapper.toResponse(store),
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Từ chối cửa hàng thất bại.",
      });
    }
  }

  async reactivate(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const store = await this.reactivateStoreUseCase.execute(id);

      res.status(200).json({
        success: true,
        message: "Mở khóa cửa hàng thành công.",
        data: StoreMapper.toResponse(store),
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Mở khóa cửa hàng thất bại.",
      });
    }
  }
}
