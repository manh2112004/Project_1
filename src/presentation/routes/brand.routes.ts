import { Router } from "express";
import { AppDataSource } from "../../infrastructure/database/data-source";
import { BrandOrmEntity } from "../../infrastructure/database/entities/BrandOrmEntity";
import { TypeOrmBrandRepository } from "../../infrastructure/repositories/brand/TypeOrmBrandRepository";
import { CreateBrandUseCase } from "../../application/use-cases/brand/CreateBrandUseCase";
import { BrandController } from "../controllers/BrandController";
import { UpdateBrandUseCase } from "../../application/use-cases/brand/UpdateBrandUseCase";
import { DeleteBrandUseCase } from "../../application/use-cases/brand/DeleteBrandUseCase";
import { GetBrandByIdUseCase } from "../../application/use-cases/brand/GetBrandByIdUseCase";
import { GetAllBrandUseCase } from "../../application/use-cases/brand/GetAllBrandUseCase";
import { GetBrandsPaginatedUseCase } from "../../application/use-cases/brand/GetBrandPaginationUseCase";
import { authenticate } from "../middlewares/authenticate";
import { authorize } from "../middlewares/authorize";

const BrandRouter = Router();

export const brandRouter = (): Router => {
  const brandOrmRepository = AppDataSource.getRepository(BrandOrmEntity);
  const brandRepository = new TypeOrmBrandRepository(brandOrmRepository);

  const createBrandUseCase = new CreateBrandUseCase(brandRepository);
  const updateBrandUseCase = new UpdateBrandUseCase(brandRepository);
  const deleteBrandUseCase = new DeleteBrandUseCase(brandRepository);
  const getBrandByIdUseCase = new GetBrandByIdUseCase(brandRepository);
  const getAllBrandUseCase = new GetAllBrandUseCase(brandRepository);
  const getBrandPaginationUseCase = new GetBrandsPaginatedUseCase(
    brandRepository,
  );
  const brandControlller = new BrandController(
    createBrandUseCase,
    updateBrandUseCase,
    deleteBrandUseCase,
    getBrandByIdUseCase,
    getAllBrandUseCase,
    getBrandPaginationUseCase,
  );

  // Public GET endpoints
  BrandRouter.get("/paginated", (req, res) =>
    brandControlller.getPaginated(req, res),
  );
  BrandRouter.get("/:id", (req, res) => brandControlller.getById(req, res));
  BrandRouter.get("/", (req, res) => brandControlller.getAll(req, res));

  // Protected Mutating endpoints
  BrandRouter.post("/", authenticate, authorize("CREATE_BRAND"), (req, res) =>
    brandControlller.create(req, res),
  );
  BrandRouter.put("/:id", authenticate, authorize("UPDATE_BRAND"), (req, res) =>
    brandControlller.update(req, res),
  );
  BrandRouter.delete("/:id", authenticate, authorize("DELETE_BRAND"), (req, res) =>
    brandControlller.delete(req, res),
  );

  return BrandRouter;
};
