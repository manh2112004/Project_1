import { Router } from "express";
import { AppDataSource } from "../../infrastructure/database/data-source";
import { StoreOrmEntity } from "../../infrastructure/database/entities/StoreOrmEntity";
import { StoreAddressOrmEntity } from "../../infrastructure/database/entities/StoreAddressOrmEntity";
import { TypeOrmStoreRepository } from "../../infrastructure/repositories/store/TypeOrmStoreRepository";
import { TypeOrmStoreAddressRepository } from "../../infrastructure/repositories/store-address/TypeOrmStoreAddressRepository";
import {
  CreateStoreAddressUseCase,
  UpdateStoreAddressUseCase,
  GetStoreAddressesByStoreIdUseCase,
  DeleteStoreAddressUseCase,
  SetDefaultStoreAddressUseCase,
} from "../../application/use-cases/store-address/StoreAddressUseCases";
import { StoreAddressController } from "../controllers/StoreAddressController";
import { authenticate } from "../middlewares/authenticate";
import { authorizeRoles } from "../middlewares/authorize";

export const createStoreAddressRouter = (): Router => {
  const router = Router();

  const storeOrmRepo = AppDataSource.getRepository(StoreOrmEntity);
  const storeRepo = new TypeOrmStoreRepository(storeOrmRepo);

  const addressOrmRepo = AppDataSource.getRepository(StoreAddressOrmEntity);
  const addressRepo = new TypeOrmStoreAddressRepository(addressOrmRepo);

  const createStoreAddressUseCase = new CreateStoreAddressUseCase(
    addressRepo,
    storeRepo,
  );
  const updateStoreAddressUseCase = new UpdateStoreAddressUseCase(addressRepo);
  const getStoreAddressesByStoreIdUseCase =
    new GetStoreAddressesByStoreIdUseCase(addressRepo);
  const deleteStoreAddressUseCase = new DeleteStoreAddressUseCase(addressRepo);
  const setDefaultStoreAddressUseCase = new SetDefaultStoreAddressUseCase(
    addressRepo,
  );

  const controller = new StoreAddressController(
    createStoreAddressUseCase,
    updateStoreAddressUseCase,
    getStoreAddressesByStoreIdUseCase,
    deleteStoreAddressUseCase,
    setDefaultStoreAddressUseCase,
  );

  // Endpoint công khai xem danh sách kho của cửa hàng
  router.get("/store/:storeId", (req, res) =>
    controller.getByStoreId(req, res),
  );

  // Bảo vệ các endpoints quản lý kho hàng bằng JWT authenticate
  router.use(authenticate);

  router.post("/", (req, res) => controller.create(req, res));
  router.put("/:id", (req, res) => controller.update(req, res));
  router.delete("/:id", (req, res) => controller.delete(req, res));
  router.patch("/:id/default", (req, res) => controller.setDefault(req, res));

  return router;
};
