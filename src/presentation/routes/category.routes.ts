import { Router } from 'express';
import { CategoryController } from '../controllers/CategoryController';
import { CreateCategoryUseCase } from '../../application/use-cases/category/CreateCategoryUseCase';
import { TypeOrmCategoryRepository } from '../../infrastructure/repositories/category/TypeOrmCategoryRepository';
import { AppDataSource } from '../../infrastructure/database/data-source';
import { CategoryOrmEntity } from '../../infrastructure/database/entities/CategoryOrmEntity';
import { ProductOrmEntity } from '../../infrastructure/database/entities/ProductOrmEntity';
import { TypeOrmProductRepository } from '../../infrastructure/repositories/product/TypeOrmProductRepository';
import { UpdateCategoryUseCase } from '../../application/use-cases/category/UpdateCategoryUseCase';
import { DeleteCategoryUseCase } from '../../application/use-cases/category/DeleteCategoryUseCase';
import { GetCategoryByIdUseCase } from '../../application/use-cases/category/GetCategoryByIdUseCase';
import { GetAllCategoryUseCase } from '../../application/use-cases/category/GetAllCategoryUseCase';

const categoryRouter = Router();

export const createCategoryRouter = (): Router => {
  const categoryOrmRepository = AppDataSource.getRepository(CategoryOrmEntity);
  const categoryRepository = new TypeOrmCategoryRepository(categoryOrmRepository);

  const productOrmRepository = AppDataSource.getRepository(ProductOrmEntity);
  const productRepository = new TypeOrmProductRepository(productOrmRepository);

  const createCategoryUseCase = new CreateCategoryUseCase(categoryRepository);
  const updateCategoryUseCase = new UpdateCategoryUseCase(categoryRepository);
  const deleteCategoryUseCase = new DeleteCategoryUseCase(categoryRepository, productRepository);
  const getCategoryByIdUseCase = new GetCategoryByIdUseCase(categoryRepository);
  const getAllCategoryUseCase = new GetAllCategoryUseCase(categoryRepository);
  const categoryController = new CategoryController(createCategoryUseCase, updateCategoryUseCase, deleteCategoryUseCase, getCategoryByIdUseCase, getAllCategoryUseCase);

  categoryRouter.post('/', (req, res) => categoryController.create(req, res));
  categoryRouter.put('/:id', (req, res) => categoryController.update(req, res));
  categoryRouter.delete('/:id', (req, res) => categoryController.delete(req, res));
  categoryRouter.get('/:id', (req, res) => categoryController.getById(req, res));
  categoryRouter.get('/', (req, res) => categoryController.getAll(req, res));
  return categoryRouter;
};
