import { Router } from "express";
import { AppDataSource } from "../../infrastructure/database/data-source";
import { PermissionOrmEntity } from "../../infrastructure/database/entities/PermissionOrmEntity";
import { RoleOrmEntity } from "../../infrastructure/database/entities/RoleOrmEntity";
import { TypeOrmPermissionRepository } from "../../infrastructure/repositories/permission/TypeOrmPermissionRepository";
import { TypeOrmRoleRepository } from "../../infrastructure/repositories/role/TypeOrmRoleRepository";
import { CreatePermissionUseCase } from "../../application/use-cases/permission/CreatePermissionUseCase";
import { GetPermissionByIdUseCase } from "../../application/use-cases/permission/GetPermissionByIdUseCase";
import { GetAllPermissionUseCase } from "../../application/use-cases/permission/GetAllPermissionUseCase";
import { GetPermissionPaginationUseCase } from "../../application/use-cases/permission/GetPermissionPaginationUseCase";
import { PermissionController } from "../controllers/PermissionController";

const PermissionRouter = Router();

export const permissionRouter = (): Router => {
  const permissionOrmRepository =
    AppDataSource.getRepository(PermissionOrmEntity);
  const roleOrmRepository = AppDataSource.getRepository(RoleOrmEntity);
  const permissionRepository = new TypeOrmPermissionRepository(
    permissionOrmRepository,
  );
  const roleRepository = new TypeOrmRoleRepository(roleOrmRepository);
  const createPermissionUseCase = new CreatePermissionUseCase(
    permissionRepository,
    roleRepository,
  );
  const getPermissionByIdUseCase = new GetPermissionByIdUseCase(
    permissionRepository,
  );
  const getAllPermissionUseCase = new GetAllPermissionUseCase(
    permissionRepository,
  );
  const getPermissionPaginationUseCase = new GetPermissionPaginationUseCase(
    permissionRepository,
  );

  const permissionController = new PermissionController(
    createPermissionUseCase,
    getPermissionByIdUseCase,
    getAllPermissionUseCase,
    getPermissionPaginationUseCase,
  );

  PermissionRouter.get("/paginated", (req, res) =>
    permissionController.getPaginated(req, res),
  );
  PermissionRouter.post("/", (req, res) =>
    permissionController.create(req, res),
  );
  PermissionRouter.get("/:id", (req, res) =>
    permissionController.getById(req, res),
  );
  PermissionRouter.get("/", (req, res) =>
    permissionController.getAll(req, res),
  );

  return PermissionRouter;
};
