import { CategoryNotFoundError } from '../../../domain/errors/category/CategoryNotFoundError';
import { CategoryHasProductsError } from '../../../domain/errors/category/CategoryHasProductsError';
import { DomainError } from '../../../domain/errors/DomainError';
import { Result, ok, fail } from '../../../domain/common/Result';
import { ICategoryRepository } from '../../../domain/repositories/ICategoryRepository';
import { IProductRepository } from '../../../domain/repositories/IProductRepository';

export class DeleteCategoryUseCase {
  constructor(
    private readonly categoryRepository: ICategoryRepository,
    private readonly productRepository: IProductRepository
  ) {}

  async execute(id: string): Promise<Result<void, DomainError>> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      return fail(new CategoryNotFoundError(id));
    }

    // Kiểm tra xem danh mục có chứa sản phẩm nào không
    const products = await this.productRepository.findByCategoryId(id);
    if (products.length > 0) {
      return fail(new CategoryHasProductsError(id));
    }

    category.delete();
    await this.categoryRepository.save(category);

    return ok(undefined);
  }
}