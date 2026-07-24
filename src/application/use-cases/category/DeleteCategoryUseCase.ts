import { CategoryNotFoundError } from '../../../domain/errors/category/CategoryNotFoundError';
import { ICategoryRepository } from '../../../domain/repositories/ICategoryRepository';
import { IProductRepository } from '../../../domain/repositories/IProductRepository';

export class DeleteCategoryUseCase {
  constructor(
    private readonly categoryRepository: ICategoryRepository,
    private readonly productRepository: IProductRepository
  ) {}

  async execute(id: string): Promise<void> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new CategoryNotFoundError(id);
    }

    // Kiểm tra xem danh mục có chứa sản phẩm nào không
    const products = await this.productRepository.findByCategoryId(id);
    if (products.length > 0) {
      throw new Error("Không thể xóa danh mục này vì vẫn còn sản phẩm thuộc danh mục.");
    }

    category.delete();
    await this.categoryRepository.save(category);
  }
}