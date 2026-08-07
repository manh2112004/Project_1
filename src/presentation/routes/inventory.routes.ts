import { Router } from "express";
import { AppDataSource } from "../../infrastructure/database/data-source";
import { InventoryOrmEntity } from "../../infrastructure/database/entities/InventoryOrmEntity";
import { ProductOrmEntity } from "../../infrastructure/database/entities/ProductOrmEntity";
import { TypeOrmInventoryRepository } from "../../infrastructure/repositories/inventory/TypeOrmInventoryRepository";
import { TypeOrmProductRepository } from "../../infrastructure/repositories/product/TypeOrmProductRepository";
import { CreateInventoryUseCase } from "../../application/use-cases/inventory/CreateInventoryUseCase";
import { UpdateInventoryUseCase } from "../../application/use-cases/inventory/UpdateInventoryUseCase";
import { DeleteInventoryUseCase } from "../../application/use-cases/inventory/DeleteInventoryUseCase";
import { GetInventoryByIdUseCase } from "../../application/use-cases/inventory/GetInventoryByIdUseCase";
import { GetAllInventoryUseCase } from "../../application/use-cases/inventory/GetAllInventoryUseCase";
import { InventoryController } from "../controllers/InventoryController";
import { authenticate } from "../middlewares/authenticate";
import { authorize } from "../middlewares/authorize";

const inventoryRouterInstance = Router();

export const inventoryRouter = (): Router => {
    // 1. Repositories
    const inventoryOrmRepository = AppDataSource.getRepository(InventoryOrmEntity);
    const inventoryRepository = new TypeOrmInventoryRepository(inventoryOrmRepository);

    const productOrmRepository = AppDataSource.getRepository(ProductOrmEntity);
    const productRepository = new TypeOrmProductRepository(productOrmRepository);

    // 2. Use Cases
    const createInventoryUseCase = new CreateInventoryUseCase(inventoryRepository, productRepository);
    const updateInventoryUseCase = new UpdateInventoryUseCase(inventoryRepository);
    const deleteInventoryUseCase = new DeleteInventoryUseCase(inventoryRepository);
    const getInventoryByIdUseCase = new GetInventoryByIdUseCase(inventoryRepository);
    const getAllInventoryUseCase = new GetAllInventoryUseCase(inventoryRepository);

    // 3. Controller
    const inventoryController = new InventoryController(
        createInventoryUseCase,
        updateInventoryUseCase,
        deleteInventoryUseCase,
        getInventoryByIdUseCase,
        getAllInventoryUseCase
    );

    // 4. Protected Routes (Kiểm tra quyền hạn chi tiết)
    inventoryRouterInstance.post("/", authenticate, authorize("IMPORT_INVENTORY"), (req, res) => inventoryController.create(req, res));
    inventoryRouterInstance.put("/:id", authenticate, authorize("UPDATE_INVENTORY"), (req, res) => inventoryController.update(req, res));
    inventoryRouterInstance.delete("/:id", authenticate, authorize("UPDATE_INVENTORY"), (req, res) => inventoryController.delete(req, res));
    inventoryRouterInstance.get("/:id", authenticate, authorize("READ_INVENTORY"), (req, res) => inventoryController.getById(req, res));
    inventoryRouterInstance.get("/", authenticate, authorize("READ_INVENTORY"), (req, res) => inventoryController.getAll(req, res));

    return inventoryRouterInstance;
};
