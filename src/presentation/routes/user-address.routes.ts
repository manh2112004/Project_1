import { Router } from "express";
import { AppDataSource } from "../../infrastructure/database/data-source";
import { UserAddressOrmEntity } from "../../infrastructure/database/entities/UserAddressOrmEntity";
import { TypeOrmUserAddressRepository } from "../../infrastructure/repositories/user-address/TypeOrmUserAddressRepository";
import { CreateUserAddressUseCase } from "../../application/use-cases/user-address/CreateUserAddressUseCase";
import { GetUserAddressesByUserIdUseCase } from "../../application/use-cases/user-address/GetUserAddressesByUserIdUseCase";
import { UpdateUserAddressUseCase } from "../../application/use-cases/user-address/UpdateUserAddressUseCase";
import { DeleteUserAddressUseCase } from "../../application/use-cases/user-address/DeleteUserAddressUseCase";
import { SetDefaultUserAddressUseCase } from "../../application/use-cases/user-address/SetDefaultUserAddressUseCase";
import { UserAddressController } from "../controllers/UserAddressController";
import { authenticate } from "../middlewares/authenticate";

export const createUserAddressRouter = (): Router => {
  const router = Router();

  const userAddressOrmRepo = AppDataSource.getRepository(UserAddressOrmEntity);
  const userAddressRepo = new TypeOrmUserAddressRepository(userAddressOrmRepo);

  const createUserAddressUseCase = new CreateUserAddressUseCase(userAddressRepo);
  const getUserAddressesByUserIdUseCase = new GetUserAddressesByUserIdUseCase(userAddressRepo);
  const updateUserAddressUseCase = new UpdateUserAddressUseCase(userAddressRepo);
  const deleteUserAddressUseCase = new DeleteUserAddressUseCase(userAddressRepo);
  const setDefaultUserAddressUseCase = new SetDefaultUserAddressUseCase(userAddressRepo);

  const userAddressController = new UserAddressController(
    createUserAddressUseCase,
    getUserAddressesByUserIdUseCase,
    updateUserAddressUseCase,
    deleteUserAddressUseCase,
    setDefaultUserAddressUseCase
  );

  // Bảo vệ tất cả các endpoints của sổ địa chỉ bằng JWT authenticate middleware
  router.use(authenticate);

  router.get("/me", (req, res) => userAddressController.getMyAddresses(req, res));
  router.get("/user/:userId", (req, res) => userAddressController.getByUserId(req, res));
  router.post("/", (req, res) => userAddressController.create(req, res));
  router.put("/:id", (req, res) => userAddressController.update(req, res));
  router.delete("/:id", (req, res) => userAddressController.delete(req, res));
  router.patch("/:id/default", (req, res) => userAddressController.setDefault(req, res));

  return router;
};
