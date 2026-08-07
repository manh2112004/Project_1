import { Router } from "express";
import { AppDataSource } from "../../infrastructure/database/data-source";
import { UserOrmEntity } from "../../infrastructure/database/entities/UserOrmEntity";
import { RoleOrmEntity } from "../../infrastructure/database/entities/RoleOrmEntity";
import { TypeOrmUserRepository } from "../../infrastructure/repositories/user/TypeOrmUserRepository";
import { TypeOrmRoleRepository } from "../../infrastructure/repositories/role/TypeOrmRoleRepository";
import { BcryptPasswordService } from "../../infrastructure/services/BcryptPasswordService";

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

import { UserController } from "../controllers/UserController";
import { authenticate } from "../middlewares/authenticate";
import { authorize } from "../middlewares/authorize";

export const userRouter = (): Router => {
  const router = Router();

  const userOrmRepository = AppDataSource.getRepository(UserOrmEntity);
  const roleOrmRepository = AppDataSource.getRepository(RoleOrmEntity);

  const userRepository = new TypeOrmUserRepository(userOrmRepository);
  const roleRepository = new TypeOrmRoleRepository(roleOrmRepository);
  const passwordService = new BcryptPasswordService();

  // Khởi tạo các Use Cases
  const createUserByAdminUseCase = new CreateUserByAdminUseCase(
    userRepository,
    roleRepository,
    passwordService,
  );
  const getUserProfileUseCase = new GetUserProfileUseCase(userRepository);
  const updateUserProfileUseCase = new UpdateUserProfileUseCase(userRepository);
  const changeUserPasswordUseCase = new ChangeUserPasswordUseCase(
    userRepository,
    passwordService,
  );
  const getUsersPaginatedUseCase = new GetUsersPaginatedUseCase(userRepository);
  const getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
  const deleteUserUseCase = new DeleteUserUseCase(userRepository);
  const changeUserRoleUseCase = new ChangeUserRoleUseCase(
    userRepository,
    roleRepository,
  );
  const blockUserUseCase = new BlockUserUseCase(userRepository);
  const activateUserUseCase = new ActivateUserUseCase(userRepository);

  const userController = new UserController(
    createUserByAdminUseCase,
    getUserProfileUseCase,
    updateUserProfileUseCase,
    changeUserPasswordUseCase,
    getUsersPaginatedUseCase,
    getUserByIdUseCase,
    deleteUserUseCase,
    changeUserRoleUseCase,
    blockUserUseCase,
    activateUserUseCase,
  );

  // 1. Các routes cá nhân dành cho Người dùng hiện tại (Yêu cầu đăng nhập)
  router.get("/me", authenticate, (req, res) => userController.getMe(req, res));
  router.put("/me", authenticate, (req, res) =>
    userController.updateMe(req, res),
  );
  router.put("/me/change-password", authenticate, (req, res) =>
    userController.changePassword(req, res),
  );

  // 2. Các routes quản trị người dùng (Bảo vệ bằng authorize)
  router.post("/", authenticate, authorize("CREATE_USER"), (req, res) =>
    userController.createUserByAdmin(req, res),
  );
  router.get("/paginated", authenticate, authorize("READ_USER"), (req, res) =>
    userController.getPaginated(req, res),
  );
  // ROUTE SSE REALTIME (Phải đặt TRƯỚC /:id để tránh trùng params)
  router.get("/sse", authenticate, (req, res) =>
    userController.connectSse(req, res),
  );
  router.get("/:id", authenticate, authorize("READ_USER"), (req, res) =>
    userController.getById(req, res),
  );
  router.put("/:id", authenticate, authorize("UPDATE_USER"), (req, res) =>
    userController.updateUserByAdmin(req, res),
  );
  router.delete("/:id", authenticate, authorize("DELETE_USER"), (req, res) =>
    userController.delete(req, res),
  );
  router.put("/:id/role", authenticate, authorize("ASSIGN_PERMISSION"), (req, res) =>
    userController.changeRole(req, res),
  );
  router.patch("/:id/block", authenticate, authorize("DELETE_USER"), (req, res) =>
    userController.block(req, res),
  );
  router.patch("/:id/activate", authenticate, authorize("DELETE_USER"), (req, res) =>
    userController.activate(req, res),
  );
  return router;
};
