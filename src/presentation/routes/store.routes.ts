import { Router } from "express";
import { AppDataSource } from "../../infrastructure/database/data-source";
import { StoreOrmEntity } from "../../infrastructure/database/entities/StoreOrmEntity";
import { TypeOrmStoreRepository } from "../../infrastructure/repositories/store/TypeOrmStoreRepository";
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
import { StoreController } from "../controllers/StoreController";
import { authenticate } from "../middlewares/authenticate";
import { authorizeRoles } from "../middlewares/authorize";

export const createStoreRouter = (): Router => {
  const router = Router();

  const storeOrmRepo = AppDataSource.getRepository(StoreOrmEntity);
  const storeRepo = new TypeOrmStoreRepository(storeOrmRepo);

  const registerStoreUseCase = new RegisterStoreUseCase(storeRepo);
  const getStoreByIdUseCase = new GetStoreByIdUseCase(storeRepo);
  const getStoreByUserIdUseCase = new GetStoreByUserIdUseCase(storeRepo);
  const getStoresPaginatedUseCase = new GetStoresPaginatedUseCase(storeRepo);
  const updateStoreProfileUseCase = new UpdateStoreProfileUseCase(storeRepo);
  const approveStoreUseCase = new ApproveStoreUseCase(storeRepo);
  const suspendStoreUseCase = new SuspendStoreUseCase(storeRepo);
  const rejectStoreUseCase = new RejectStoreUseCase(storeRepo);
  const reactivateStoreUseCase = new ReactivateStoreUseCase(storeRepo);
  const toggleVacationModeUseCase = new ToggleVacationModeUseCase(storeRepo);
  const updateStoreLegalInfoUseCase = new UpdateStoreLegalInfoUseCase(storeRepo);

  const storeController = new StoreController(
    registerStoreUseCase,
    getStoreByIdUseCase,
    getStoreByUserIdUseCase,
    getStoresPaginatedUseCase,
    updateStoreProfileUseCase,
    approveStoreUseCase,
    suspendStoreUseCase,
    rejectStoreUseCase,
    reactivateStoreUseCase,
    toggleVacationModeUseCase,
    updateStoreLegalInfoUseCase
  );

  // Public Endpoints
  router.get("/paginated", (req, res) => storeController.getPaginated(req, res));
  router.get("/:id", (req, res) => storeController.getById(req, res));

  // User / Seller Authenticated Endpoints
  router.post("/register", authenticate, (req, res) => storeController.register(req, res));
  router.get("/me", authenticate, authorizeRoles("SELLER", "SUPER_ADMIN", "ADMIN"), (req, res) => storeController.getMyStore(req, res));
  router.put("/profile", authenticate, authorizeRoles("SELLER", "SUPER_ADMIN", "ADMIN"), (req, res) => storeController.updateProfile(req, res));
  router.put("/legal-info", authenticate, authorizeRoles("SELLER", "SUPER_ADMIN", "ADMIN"), (req, res) => storeController.updateLegalInfo(req, res));
  router.patch("/vacation", authenticate, authorizeRoles("SELLER", "SUPER_ADMIN", "ADMIN"), (req, res) => storeController.toggleVacation(req, res));

  // Admin / Staff Management Endpoints
  router.patch("/:id/approve", authenticate, authorizeRoles("SUPER_ADMIN", "ADMIN"), (req, res) => storeController.approve(req, res));
  router.patch("/:id/suspend", authenticate, authorizeRoles("SUPER_ADMIN", "ADMIN"), (req, res) => storeController.suspend(req, res));
  router.patch("/:id/reject", authenticate, authorizeRoles("SUPER_ADMIN", "ADMIN"), (req, res) => storeController.reject(req, res));
  router.patch("/:id/reactivate", authenticate, authorizeRoles("SUPER_ADMIN", "ADMIN"), (req, res) => storeController.reactivate(req, res));

  return router;
};
