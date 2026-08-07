import { Router } from "express";
import { AppDataSource } from "../../infrastructure/database/data-source";
import { RoleOrmEntity } from "../../infrastructure/database/entities/RoleOrmEntity";
import { TypeOrmRoleRepository } from "../../infrastructure/repositories/role/TypeOrmRoleRepository";
import { CreateRoleUseCase } from "../../application/use-cases/role/CreateRoleUseCase";
import { UpdateRoleUseCase } from "../../application/use-cases/role/UpdateRoleUseCase";
import { DeleteRoleUseCase } from "../../application/use-cases/role/DeleteRoleUseCase";
import { GetRoleByIdUseCase } from "../../application/use-cases/role/GetRoleByIdUseCase";
import { GetAllRoleUseCase } from "../../application/use-cases/role/GetAllRoleUseCase";
import { GetRolePaginationUseCase } from "../../application/use-cases/role/GetRolePaginationUseCase";
import { AssignPermissionToRoleUseCase } from "../../application/use-cases/role/AssignPermissionToRoleUseCase";
import { RevokePermissionFromRoleUseCase } from "../../application/use-cases/role/RevokePermissionFromRoleUseCase";
import { RoleController } from "../controllers/RoleController";
import { authenticate } from "../middlewares/authenticate";
import { authorize } from "../middlewares/authorize";

const RoleRouter = Router();

export const roleRouter = (): Router => {
  const roleOrmRepository = AppDataSource.getRepository(RoleOrmEntity);
  const roleRepository = new TypeOrmRoleRepository(roleOrmRepository);

  const createRoleUseCase = new CreateRoleUseCase(roleRepository);
  const updateRoleUseCase = new UpdateRoleUseCase(roleRepository);
  const deleteRoleUseCase = new DeleteRoleUseCase(roleRepository);
  const getRoleByIdUseCase = new GetRoleByIdUseCase(roleRepository);
  const getAllRoleUseCase = new GetAllRoleUseCase(roleRepository);
  const getRolePaginationUseCase = new GetRolePaginationUseCase(roleRepository);
  const assignPermissionToRoleUseCase = new AssignPermissionToRoleUseCase(roleRepository);
  const revokePermissionFromRoleUseCase = new RevokePermissionFromRoleUseCase(roleRepository);

  const roleController = new RoleController(
    createRoleUseCase,
    updateRoleUseCase,
    deleteRoleUseCase,
    getRoleByIdUseCase,
    getAllRoleUseCase,
    getRolePaginationUseCase,
    assignPermissionToRoleUseCase,
    revokePermissionFromRoleUseCase,
  );

  // Bảo vệ tất cả các API quản lý Vai trò bằng authenticate JWT middleware
  RoleRouter.use(authenticate);

  RoleRouter.get("/paginated", authorize("READ_ROLE"), (req, res) => roleController.getPaginated(req, res));
  RoleRouter.post("/", authorize("CREATE_ROLE"), (req, res) => roleController.create(req, res));
  RoleRouter.put("/:id", authorize("UPDATE_ROLE"), (req, res) => roleController.update(req, res));
  RoleRouter.delete("/:id", authorize("DELETE_ROLE"), (req, res) => roleController.delete(req, res));
  RoleRouter.post("/:id/permissions", authorize("ASSIGN_PERMISSION"), (req, res) => roleController.assignPermissions(req, res));
  RoleRouter.post("/:id/permissions/revoke", authorize("ASSIGN_PERMISSION"), (req, res) => roleController.revokePermissions(req, res));
  RoleRouter.get("/:id", authorize("READ_ROLE"), (req, res) => roleController.getById(req, res));
  RoleRouter.get("/", authorize("READ_ROLE"), (req, res) => roleController.getAll(req, res));

  return RoleRouter;
};
