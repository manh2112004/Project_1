import { describe, it, expect, beforeEach } from 'vitest';
import { CreateCategoryUseCase } from '../CreateCategoryUseCase';
import { UpdateCategoryUseCase } from '../UpdateCategoryUseCase';
import { DeleteCategoryUseCase } from '../DeleteCategoryUseCase';
import { GetCategoryByIdUseCase } from '../GetCategoryByIdUseCase';
import { GetAllCategoryUseCase } from '../GetAllCategoryUseCase';
import { GetCategoriesPaginatedUseCase } from '../GetCategoriesPaginatedUseCase';
import { InMemoryCategoryRepository } from '../../../../infrastructure/repositories/category/InMemoryCategoryRepository';

describe('Category Use Cases Result Standard Test Suite', () => {
  let categoryRepo: InMemoryCategoryRepository;
  let mockProductRepo: any;
  let createUseCase: CreateCategoryUseCase;
  let updateUseCase: UpdateCategoryUseCase;
  let deleteUseCase: DeleteCategoryUseCase;
  let getByIdUseCase: GetCategoryByIdUseCase;
  let getAllUseCase: GetAllCategoryUseCase;
  let getPaginatedUseCase: GetCategoriesPaginatedUseCase;

  beforeEach(() => {
    categoryRepo = new InMemoryCategoryRepository();
    mockProductRepo = {
      findByCategoryId: async (id: string) => [],
    };
    createUseCase = new CreateCategoryUseCase(categoryRepo);
    updateUseCase = new UpdateCategoryUseCase(categoryRepo);
    deleteUseCase = new DeleteCategoryUseCase(categoryRepo, mockProductRepo);
    getByIdUseCase = new GetCategoryByIdUseCase(categoryRepo);
    getAllUseCase = new GetAllCategoryUseCase(categoryRepo);
    getPaginatedUseCase = new GetCategoriesPaginatedUseCase(categoryRepo);
  });

  it('should return ok Result when creating category successfully', async () => {
    const res = await createUseCase.execute({ name: 'Điện thoại', slug: 'dien-thoai' });
    expect(res.isSuccess).toBe(true);
    if (res.isSuccess) {
      expect(res.value.name).toBe('Điện thoại');
      expect(res.value.slug).toBe('dien-thoai');
    }
  });

  it('should return fail Result with DomainError when creating category with empty name', async () => {
    const res = await createUseCase.execute({ name: '', slug: 'invalid' });
    expect(res.isFailure).toBe(true);
    if (res.isFailure) {
      expect(res.error.code).toBe('INVALID_CATEGORY_NAME');
      expect(res.error.statusCode).toBe(400);
    }
  });

  it('should return fail Result when getting non-existent category by ID', async () => {
    const res = await getByIdUseCase.execute('non-existent-id');
    expect(res.isFailure).toBe(true);
    if (res.isFailure) {
      expect(res.error.code).toBe('CATEGORY_NOT_FOUND');
      expect(res.error.statusCode).toBe(404);
    }
  });

  it('should return ok Result when updating category successfully', async () => {
    const createRes = await createUseCase.execute({ name: 'Laptop', slug: 'laptop' });
    expect(createRes.isSuccess).toBe(true);
    if (!createRes.isSuccess) return;

    const updateRes = await updateUseCase.execute({
      id: createRes.value.id,
      name: 'Laptop Gaming',
    });
    expect(updateRes.isSuccess).toBe(true);
    if (updateRes.isSuccess) {
      expect(updateRes.value.name).toBe('Laptop Gaming');
    }
  });

  it('should return fail Result when deleting category with existing products', async () => {
    const createRes = await createUseCase.execute({ name: 'Thời trang' });
    expect(createRes.isSuccess).toBe(true);
    if (!createRes.isSuccess) return;

    mockProductRepo.findByCategoryId = async (id: string) => [{ id: 'p1' }];

    const deleteRes = await deleteUseCase.execute(createRes.value.id);
    expect(deleteRes.isFailure).toBe(true);
    if (deleteRes.isFailure) {
      expect(deleteRes.error.code).toBe('CATEGORY_HAS_PRODUCTS');
      expect(deleteRes.error.statusCode).toBe(400);
    }
  });
});
