import { Router } from "express";
import { AppDataSource } from "../../infrastructure/database/data-source";
import { ProductOrmEntity } from "../../infrastructure/database/entities/ProductOrmEntity";
import { CategoryOrmEntity } from "../../infrastructure/database/entities/CategoryOrmEntity";
import { BrandOrmEntity } from "../../infrastructure/database/entities/BrandOrmEntity";
import { TypeOrmProductRepository } from "../../infrastructure/repositories/product/TypeOrmProductRepository";
import { TypeOrmCategoryRepository } from "../../infrastructure/repositories/category/TypeOrmCategoryRepository";
import { TypeOrmBrandRepository } from "../../infrastructure/repositories/brand/TypeOrmBrandRepository";
import { CreateProductUseCase } from "../../application/use-cases/product/CreateProductUseCase";
import { UpdateProductUseCase } from "../../application/use-cases/product/UpdateProductUseCase";
import { DeleteProductUseCase } from "../../application/use-cases/product/DeleteProductUseCase";
import { GetProductByIdUseCase } from "../../application/use-cases/product/GetProductByIdUseCase";
import { GetAllProductUseCase } from "../../application/use-cases/product/GetAllProductUseCase";
import { ProductController } from "../controllers/ProductController";
import { TypeOrmInventoryRepository } from "../../infrastructure/repositories/inventory/TypeOrmInventoryRepository";
import { InventoryOrmEntity } from "../../infrastructure/database/entities/InventoryOrmEntity";
import { ProductImageOrmEntity } from "../../infrastructure/database/entities/ProductImageOrmEntity";
import { TypeOrmProductImageRepository } from "../../infrastructure/repositories/product-image/TypeOrmProductImageRepository";
const productRouterInstance = Router();

export const productRouter = (): Router => {
    const productOrmRepository = AppDataSource.getRepository(ProductOrmEntity);
    const inventoryOrmRepository = AppDataSource.getRepository(InventoryOrmEntity)
    const categoryOrmRepository = AppDataSource.getRepository(CategoryOrmEntity);
    const brandOrmRepository = AppDataSource.getRepository(BrandOrmEntity);
    const productImageOrmRepository = AppDataSource.getRepository(ProductImageOrmEntity)
    const productRepository = new TypeOrmProductRepository(productOrmRepository);
    const categoryRepository = new TypeOrmCategoryRepository(categoryOrmRepository);
    const inventoryRepository = new TypeOrmInventoryRepository(inventoryOrmRepository)
    const brandRepository = new TypeOrmBrandRepository(brandOrmRepository);
    const productImageRepository=new TypeOrmProductImageRepository(productImageOrmRepository)
    // 2. Use Cases
    const createProductUseCase = new CreateProductUseCase(productRepository, categoryRepository, brandRepository);
    const updateProductUseCase = new UpdateProductUseCase(productRepository, categoryRepository, brandRepository);
    const deleteProductUseCase = new DeleteProductUseCase(productRepository, inventoryRepository,productImageRepository);
    const getProductByIdUseCase = new GetProductByIdUseCase(productRepository);
    const getAllProductUseCase = new GetAllProductUseCase(productRepository);

    // 3. Controller
    const productController = new ProductController(
        createProductUseCase,
        updateProductUseCase,
        deleteProductUseCase,
        getProductByIdUseCase,
        getAllProductUseCase
    );

    productRouterInstance.post("/", (req, res) => productController.create(req, res));
    productRouterInstance.put("/:id", (req, res) => productController.update(req, res));
    productRouterInstance.delete("/:id", (req, res) => productController.delete(req, res));
    productRouterInstance.get("/:id", (req, res) => productController.getById(req, res));
    productRouterInstance.get("/", (req, res) => productController.getAll(req, res));

    return productRouterInstance;
};
