import { Router } from "express";
import { AppDataSource } from "../../infrastructure/database/data-source";
import { ProductImageOrmEntity } from "../../infrastructure/database/entities/ProductImageOrmEntity";
import { ProductOrmEntity } from "../../infrastructure/database/entities/ProductOrmEntity";
import { TypeOrmProductImageRepository } from "../../infrastructure/repositories/product-image/TypeOrmProductImageRepository";
import { TypeOrmProductRepository } from "../../infrastructure/repositories/product/TypeOrmProductRepository";
import { CloudinaryService } from "../../infrastructure/services/CloudinaryService";
import { CreateProductImageUseCase } from "../../application/use-cases/product-image/CreateProductImageUseCase";
import { DeleteProductImageUseCase } from "../../application/use-cases/product-image/DeleteProductImageUseCase";
import { ProductImageController } from "../controllers/ProductImageController";
import { upload } from "../middlewares/upload";

const productImageRouterInstance = Router();

export const productImageRouter = (): Router => {
    const cloudinaryService = new CloudinaryService();

    const productImageOrmRepository = AppDataSource.getRepository(ProductImageOrmEntity);
    const productImageRepository = new TypeOrmProductImageRepository(productImageOrmRepository);

    const productOrmRepository = AppDataSource.getRepository(ProductOrmEntity);
    const productRepository = new TypeOrmProductRepository(productOrmRepository);

    const createProductImageUseCase = new CreateProductImageUseCase(productImageRepository, productRepository);
    const deleteProductImageUseCase = new DeleteProductImageUseCase(productImageRepository);

    const productImageController = new ProductImageController(
        createProductImageUseCase,
        deleteProductImageUseCase,
        cloudinaryService
    );

    productImageRouterInstance.post("/", upload.single("image"), (req, res) => productImageController.create(req, res));
    productImageRouterInstance.delete("/:id", (req, res) => productImageController.delete(req, res));

    return productImageRouterInstance;
};
