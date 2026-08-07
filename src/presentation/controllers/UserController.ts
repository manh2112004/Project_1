import { Request, Response } from "express";
import { CreateUserByAdminUseCase } from "../../application/use-cases/user/CreateUserByAdminUseCase";
import { GetUserProfileUseCase } from "../../application/use-cases/user/GetUserProfileUseCase";
import { UpdateUserProfileUseCase } from "../../application/use-cases/user/UpdateUserProfileUseCase";
import { ChangeUserPasswordUseCase } from "../../application/use-cases/user/ChangeUserPasswordUseCase";
import { GetUsersPaginatedUseCase } from "../../application/use-cases/user/GetUsersPaginatedUseCase";
import { GetUserByIdUseCase } from "../../application/use-cases/user/GetUserByIdUseCase";
import { DeleteUserUseCase } from "../../application/use-cases/user/DeleteUserUseCase";
import { ChangeUserRoleUseCase } from "../../application/use-cases/user/ChangeUserRoleUseCase";
import { BlockUserUseCase } from "../../application/use-cases/user/BlockUserUseCase";
import { ActivateUserUseCase } from "../../application/use-cases/user/ActivateUserUseCase";
import { UserMapper } from "../../application/mappers/UserMapper";
import { sseManager } from "../../infrastructure/services/SseManager";
export class UserController {
  constructor(
    private readonly createUserByAdminUseCase: CreateUserByAdminUseCase,
    private readonly getUserProfileUseCase: GetUserProfileUseCase,
    private readonly updateUserProfileUseCase: UpdateUserProfileUseCase,
    private readonly changeUserPasswordUseCase: ChangeUserPasswordUseCase,
    private readonly getUsersPaginatedUseCase: GetUsersPaginatedUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly changeUserRoleUseCase: ChangeUserRoleUseCase,
    private readonly blockUserUseCase: BlockUserUseCase,
    private readonly activateUserUseCase: ActivateUserUseCase,
  ) {}
  connectSse(req: Request, res: Response): void {
    const currentUser = (req as any).user;
    sseManager.addClient(currentUser.id, res);
  }
  async createUserByAdmin(req: Request, res: Response): Promise<void> {
    try {
      const {
        roleId,
        email,
        password,
        fullName,
        phoneNumber,
        gender,
        avatarUrl,
      } = req.body;
      const user = await this.createUserByAdminUseCase.execute({
        roleId,
        email,
        password,
        fullName,
        phoneNumber,
        gender,
        avatarUrl,
      });

      res.status(201).json({
        success: true,
        message: "Admin tạo tài khoản người dùng thành công.",
        data: UserMapper.toResponse(user),
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Tạo tài khoản thất bại.",
      });
    }
  }

  async getMe(req: Request, res: Response): Promise<void> {
    try {
      const currentUser = (req as any).user;
      const user = await this.getUserProfileUseCase.execute(currentUser.id);

      res.status(200).json({
        success: true,
        data: UserMapper.toResponse(user),
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Không thể lấy thông tin cá nhân.",
      });
    }
  }

  async updateMe(req: Request, res: Response): Promise<void> {
    try {
      const currentUser = (req as any).user;
      const { fullName, avatarUrl, dateOfBirth, gender } = req.body;

      const user = await this.updateUserProfileUseCase.execute({
        userId: currentUser.id,
        fullName,
        avatarUrl,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        gender,
      });

      res.status(200).json({
        success: true,
        message: "Cập nhật thông tin cá nhân thành công",
        data: UserMapper.toResponse(user),
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Cập nhật thông tin thất bại",
      });
    }
  }

  async changePassword(req: Request, res: Response): Promise<void> {
    try {
      const currentUser = (req as any).user;
      const { oldPassword, newPassword } = req.body;

      await this.changeUserPasswordUseCase.execute({
        userId: currentUser.id,
        oldPassword,
        newPassword,
      });

      res.status(200).json({
        success: true,
        message: "Đổi mật khẩu thành công",
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Đổi mật khẩu thất bại",
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

      const result = await this.getUsersPaginatedUseCase.execute(
        page,
        limit,
        search,
      );

      res.status(200).json({
        success: true,
        data: {
          users: UserMapper.toResponseList(result.users),
          meta: result.meta,
        },
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Lấy danh sách người dùng thất bại",
      });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await this.getUserByIdUseCase.execute(String(id));

      res.status(200).json({
        success: true,
        data: UserMapper.toResponse(user),
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || "Không tìm thấy người dùng",
      });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.deleteUserUseCase.execute(String(id));

      res.status(200).json({
        success: true,
        message: "Xóa người dùng thành công",
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Xóa người dùng thất bại",
      });
    }
  }

  async changeRole(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { roleId } = req.body;

      const updatedUser = await this.changeUserRoleUseCase.execute(
        String(id),
        roleId,
      );

      res.status(200).json({
        success: true,
        message: "Cập nhật vai trò thành công",
        data: UserMapper.toResponse(updatedUser),
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Cập nhật vai trò thất bại",
      });
    }
  }

  async block(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updatedUser = await this.blockUserUseCase.execute(String(id));
      sseManager.sendToUser(id as string, "user:blocked", {
        message:
          "Tài khoản của bạn đã bị Quản trị viên khóa do vi phạm chính sách!",
      });
      res.status(200).json({
        success: true,
        message: "Khóa tài khoản thành công",
        data: UserMapper.toResponse(updatedUser),
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Khóa tài khoản thất bại",
      });
    }
  }

  async activate(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updatedUser = await this.activateUserUseCase.execute(String(id));
      sseManager.sendToUser(id as string, "user:blocked", {
        message:
          "Tài khoản của bạn đã bị Quản trị viên khóa do vi phạm chính sách!",
      });
      res.status(200).json({
        success: true,
        message: "Kích hoạt tài khoản thành công",
        data: UserMapper.toResponse(updatedUser),
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Kích hoạt tài khoản thất bại",
      });
    }
  }

  async updateUserByAdmin(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { fullName, phoneNumber, roleId, gender, status } = req.body;

      const user = await this.updateUserProfileUseCase.execute({
        userId: String(id),
        fullName,
        phoneNumber,
        gender,
      });

      if (roleId) {
        await this.changeUserRoleUseCase.execute(String(id), roleId);
      }

      if (status === "BLOCKED") {
        await this.blockUserUseCase.execute(String(id));
      } else if (status === "ACTIVE") {
        await this.activateUserUseCase.execute(String(id));
      }

      const refreshedUser = await this.getUserByIdUseCase.execute(String(id));

      res.status(200).json({
        success: true,
        message: "Cập nhật thông tin người dùng thành công",
        data: UserMapper.toResponse(refreshedUser),
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Cập nhật thông tin người dùng thất bại",
      });
    }
  }
}
