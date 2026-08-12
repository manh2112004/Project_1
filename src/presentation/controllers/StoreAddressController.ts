import { Request, Response } from "express";
import {
  CreateStoreAddressUseCase,
  UpdateStoreAddressUseCase,
  GetStoreAddressesByStoreIdUseCase,
  DeleteStoreAddressUseCase,
  SetDefaultStoreAddressUseCase,
} from "../../application/use-cases/store-address/StoreAddressUseCases";
import { StoreAddressMapper } from "../../application/mappers/StoreAddressMapper";

export class StoreAddressController {
  constructor(
    private readonly createStoreAddressUseCase: CreateStoreAddressUseCase,
    private readonly updateStoreAddressUseCase: UpdateStoreAddressUseCase,
    private readonly getStoreAddressesByStoreIdUseCase: GetStoreAddressesByStoreIdUseCase,
    private readonly deleteStoreAddressUseCase: DeleteStoreAddressUseCase,
    private readonly setDefaultStoreAddressUseCase: SetDefaultStoreAddressUseCase
  ) {}

  async getByStoreId(req: Request, res: Response): Promise<void> {
    try {
      const storeId = req.params.storeId as string;
      const addresses = await this.getStoreAddressesByStoreIdUseCase.execute(storeId);

      res.status(200).json({
        success: true,
        data: StoreAddressMapper.toResponseList(addresses),
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Lấy danh sách địa chỉ kho hàng thất bại.",
      });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const address = await this.createStoreAddressUseCase.execute(req.body);

      res.status(201).json({
        success: true,
        message: "Tạo mới địa chỉ kho thành công.",
        data: StoreAddressMapper.toResponse(address),
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Thêm mới địa chỉ kho thất bại.",
      });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const address = await this.updateStoreAddressUseCase.execute(id, req.body);

      res.status(200).json({
        success: true,
        message: "Cập nhật địa chỉ kho thành công.",
        data: StoreAddressMapper.toResponse(address),
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Cập nhật địa chỉ kho thất bại.",
      });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      await this.deleteStoreAddressUseCase.execute(id);

      res.status(200).json({
        success: true,
        message: "Xóa địa chỉ kho thành công.",
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Xóa địa chỉ kho thất bại.",
      });
    }
  }

  async setDefault(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const type = (req.query.type as "default" | "pickup" | "return") || "default";

      const address = await this.setDefaultStoreAddressUseCase.execute(id, type);

      res.status(200).json({
        success: true,
        message: "Đặt trạng thái mặc định cho kho thành công.",
        data: StoreAddressMapper.toResponse(address),
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Đặt địa chỉ mặc định thất bại.",
      });
    }
  }
}
