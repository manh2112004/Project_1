import { Request, Response } from "express";
import { CreateUserAddressUseCase } from "../../application/use-cases/user-address/CreateUserAddressUseCase";
import { GetUserAddressesByUserIdUseCase } from "../../application/use-cases/user-address/GetUserAddressesByUserIdUseCase";
import { UpdateUserAddressUseCase } from "../../application/use-cases/user-address/UpdateUserAddressUseCase";
import { DeleteUserAddressUseCase } from "../../application/use-cases/user-address/DeleteUserAddressUseCase";
import { SetDefaultUserAddressUseCase } from "../../application/use-cases/user-address/SetDefaultUserAddressUseCase";
import { UserAddressMapper } from "../../application/mappers/UserAddressMapper";

export class UserAddressController {
  constructor(
    private readonly createUserAddressUseCase: CreateUserAddressUseCase,
    private readonly getUserAddressesByUserIdUseCase: GetUserAddressesByUserIdUseCase,
    private readonly updateUserAddressUseCase: UpdateUserAddressUseCase,
    private readonly deleteUserAddressUseCase: DeleteUserAddressUseCase,
    private readonly setDefaultUserAddressUseCase: SetDefaultUserAddressUseCase,
  ) {}

  async getMyAddresses(req: Request, res: Response): Promise<void> {
    try {
      const currentUser = (req as any).user;
      const addresses = await this.getUserAddressesByUserIdUseCase.execute(
        currentUser.id,
      );
      res.status(200).json({
        success: true,
        data: UserAddressMapper.toResponseList(addresses),
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Lấy danh sách địa chỉ thất bại.",
      });
    }
  }

  async getByUserId(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId as string;
      const addresses =
        await this.getUserAddressesByUserIdUseCase.execute(userId);
      res.status(200).json({
        success: true,
        data: UserAddressMapper.toResponseList(addresses),
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Lấy danh sách địa chỉ người dùng thất bại.",
      });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const currentUser = (req as any).user;
      const {
        recipientName,
        phoneNumber,
        addressLine1,
        addressLine2,
        ward,
        district,
        city,
        country,
        postalCode,
        isDefault,
        userId: customUserId,
      } = req.body;

      const targetUserId = customUserId || currentUser.id;

      const address = await this.createUserAddressUseCase.execute({
        userId: targetUserId,
        recipientName,
        phoneNumber,
        addressLine1,
        addressLine2,
        ward,
        district,
        city,
        country,
        postalCode,
        isDefault,
      });

      res.status(201).json({
        success: true,
        message: "Tạo mới địa chỉ thành công.",
        data: UserAddressMapper.toResponse(address),
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Thêm mới địa chỉ thất bại.",
      });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const address = await this.updateUserAddressUseCase.execute(id, req.body);
      res.status(200).json({
        success: true,
        message: "Cập nhật địa chỉ thành công.",
        data: UserAddressMapper.toResponse(address),
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Cập nhật địa chỉ thất bại.",
      });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      await this.deleteUserAddressUseCase.execute(id);
      res.status(200).json({
        success: true,
        message: "Xóa địa chỉ thành công.",
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Xóa địa chỉ thất bại.",
      });
    }
  }

  async setDefault(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const address = await this.setDefaultUserAddressUseCase.execute(id);
      res.status(200).json({
        success: true,
        message: "Đặt địa chỉ làm mặc định thành công.",
        data: UserAddressMapper.toResponse(address),
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Đặt địa chỉ mặc định thất bại.",
      });
    }
  }
}
