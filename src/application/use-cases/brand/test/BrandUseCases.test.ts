import { describe, it, expect, beforeEach } from 'vitest';
import { CreateBrandUseCase } from '../CreateBrandUseCase';
import { UpdateBrandUseCase } from '../UpdateBrandUseCase';
import { DeleteBrandUseCase } from '../DeleteBrandUseCase';
import { GetBrandByIdUseCase } from '../GetBrandByIdUseCase';
import { GetAllBrandUseCase } from '../GetAllBrandUseCase';
import { GetBrandsPaginatedUseCase } from '../GetBrandPaginationUseCase';
import { Brand } from '../../../../domain/entities/Brand';
import { IBrandRepository } from '../../../../domain/repositories/IBrandRepository';

class MockBrandRepository implements IBrandRepository {
  private brands: Brand[] = [];

  async save(brand: Brand): Promise<Brand> {
    const index = this.brands.findIndex((b) => b.id === brand.id);
    if (index >= 0) {
      this.brands[index] = brand;
    } else {
      this.brands.push(brand);
    }
    return brand;
  }

  async findById(id: string): Promise<Brand | null> {
    return this.brands.find((b) => b.id === id && !b.deletedAt) || null;
  }

  async findByName(name: string): Promise<Brand | null> {
    return this.brands.find((b) => b.name.toLowerCase() === name.toLowerCase() && !b.deletedAt) || null;
  }

  async findAll(): Promise<Brand[]> {
    return this.brands.filter((b) => !b.deletedAt);
  }

  async findAndCount(page: number, limit: number, search?: string): Promise<{ brands: Brand[]; totalCount: number }> {
    let filtered = this.brands.filter((b) => !b.deletedAt);
    if (search) {
      filtered = filtered.filter((b) => b.name.toLowerCase().includes(search.toLowerCase()));
    }
    const start = (page - 1) * limit;
    return {
      brands: filtered.slice(start, start + limit),
      totalCount: filtered.length,
    };
  }

  async delete(id: string): Promise<void> {
    const brand = await this.findById(id);
    if (brand) {
      brand.delete();
    }
  }
}

describe('Brand Use Cases Result Standard Test Suite', () => {
  let brandRepo: MockBrandRepository;
  let createUseCase: CreateBrandUseCase;
  let updateUseCase: UpdateBrandUseCase;
  let deleteUseCase: DeleteBrandUseCase;
  let getByIdUseCase: GetBrandByIdUseCase;
  let getAllUseCase: GetAllBrandUseCase;
  let getPaginatedUseCase: GetBrandsPaginatedUseCase;

  beforeEach(() => {
    brandRepo = new MockBrandRepository();
    createUseCase = new CreateBrandUseCase(brandRepo);
    updateUseCase = new UpdateBrandUseCase(brandRepo);
    deleteUseCase = new DeleteBrandUseCase(brandRepo);
    getByIdUseCase = new GetBrandByIdUseCase(brandRepo);
    getAllUseCase = new GetAllBrandUseCase(brandRepo);
    getPaginatedUseCase = new GetBrandsPaginatedUseCase(brandRepo);
  });

  it('should return ok Result when creating a brand', async () => {
    const res = await createUseCase.execute({ name: 'Apple', logo: 'apple.png', description: 'Tech' });
    expect(res.isSuccess).toBe(true);
    if (res.isSuccess) {
      expect(res.value.name).toBe('Apple');
      expect(res.value.logo).toBe('apple.png');
    }
  });

  it('should return fail Result with INVALID_BRAND_NAME when creating brand with empty name', async () => {
    const res = await createUseCase.execute({ name: '', logo: null, description: null });
    expect(res.isFailure).toBe(true);
    if (res.isFailure) {
      expect(res.error.code).toBe('INVALID_BRAND_NAME');
      expect(res.error.statusCode).toBe(400);
    }
  });

  it('should return fail Result with DUPLICATE_BRAND_NAME when creating brand with existing name', async () => {
    await createUseCase.execute({ name: 'Samsung', logo: null, description: null });
    const res = await createUseCase.execute({ name: 'Samsung', logo: null, description: null });

    expect(res.isFailure).toBe(true);
    if (res.isFailure) {
      expect(res.error.code).toBe('DUPLICATE_BRAND_NAME');
      expect(res.error.statusCode).toBe(409);
    }
  });

  it('should return fail Result with BRAND_NOT_FOUND when getting non-existent brand', async () => {
    const res = await getByIdUseCase.execute('non-existent-id');
    expect(res.isFailure).toBe(true);
    if (res.isFailure) {
      expect(res.error.code).toBe('BRAND_NOT_FOUND');
      expect(res.error.statusCode).toBe(404);
    }
  });

  it('should return ok Result when updating brand successfully', async () => {
    const createRes = await createUseCase.execute({ name: 'Nike', logo: 'nike.png', description: 'Sports' });
    expect(createRes.isSuccess).toBe(true);
    if (!createRes.isSuccess) return;

    const updateRes = await updateUseCase.execute({
      id: createRes.value.id,
      name: 'Nike Official',
    });

    expect(updateRes.isSuccess).toBe(true);
    if (updateRes.isSuccess) {
      expect(updateRes.value.name).toBe('Nike Official');
    }
  });
});
