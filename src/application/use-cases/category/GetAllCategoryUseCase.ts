import { ICategoryRepository } from '../../../domain/repositories/ICategoryRepository';
import { CategoryResponseDto } from '../../dtos/category/CreateCategoryDto';
import { DomainError } from '../../../domain/errors/DomainError';
import { Result, ok } from '../../../domain/common/Result';

export class GetAllCategoryUseCase {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async execute(): Promise<Result<CategoryResponseDto[], DomainError>> {
    const categories = await this.categoryRepository.findAll();
    const data = categories.map((category) => ({
      id: category.id,
      parentId: category.parentId,
      name: category.name,
      slug: category.slug,
      description: category.description,
      image: category.image,
      isActive: category.isActive,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
    }));

    return ok(data);
  }
}