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

const BrandRouter = Router();

export const brandRouter = (): Router => {
    const brandOrmRepository = AppDataSource.getRepository(BrandOrmEntity);
    const brandRepository = new TypeOrmBrandRepository(brandOrmRepository);

    const createBrandUseCase = new CreateBrandUseCase(brandRepository);
    const updateBrandUseCase = new UpdateBrandUseCase(brandRepository);
    const deleteBrandUseCase = new DeleteBrandUseCase(brandRepository);
    const getBrandByIdUseCase = new GetBrandByIdUseCase(brandRepository);
    const getAllBrandUseCase = new GetAllBrandUseCase(brandRepository);

    const brandControlller = new BrandController(
        createBrandUseCase,
        updateBrandUseCase,
        deleteBrandUseCase,
        getBrandByIdUseCase,
        getAllBrandUseCase
    );

    BrandRouter.post("/", (req, res) => brandControlller.create(req, res));
    BrandRouter.put("/:id", (req, res) => brandControlller.update(req, res));
    BrandRouter.delete("/:id", (req, res) => brandControlller.delete(req, res));
    BrandRouter.get("/:id", (req, res) => brandControlller.getById(req, res));
    BrandRouter.get("/", (req, res) => brandControlller.getAll(req, res));

    return BrandRouter;
}