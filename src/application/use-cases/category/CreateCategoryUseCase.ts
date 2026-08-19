import { Category } from '../../../domain/entities/Category';
import { ICategoryRepository } from '../../../domain/repositories/ICategoryRepository';
import { CreateCategoryDto, CategoryResponseDto } from '../../dtos/category/CreateCategoryDto';
import { Result, ok, fail } from '../../../domain/common/Result';
import { DomainError } from '../../../domain/errors/DomainError';
import { DuplicateSlugError } from '../../../domain/errors/category/DuplicateSlugError';
import { CategoryNotFoundError } from '../../../domain/errors/category/CategoryNotFoundError';

export class CreateCategoryUseCase {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async execute(dto: CreateCategoryDto): Promise<Result<CategoryResponseDto, DomainError>> {
    // 1. Tạo Domain Entity (Domain tự validate quy tắc nghiệp vụ & trả về Result)
    const categoryResult = Category.create({
      name: dto.name,
      slug: dto.slug,
      parentId: dto.parentId,
      description: dto.description,
      image: dto.image,
      isActive: dto.isActive,
    });

    if (categoryResult.isFailure) {
      return fail(categoryResult.error);
    }

    const category = categoryResult.value;

    // 2. Kiểm tra trùng lặp slug trong DB
    const existingSlug = await this.categoryRepository.findBySlug(category.slug);
    if (existingSlug) {
      return fail(new DuplicateSlugError(category.slug));
    }

    // 3. Nếu truyền parentId, kiểm tra parentId có tồn tại hay không
    if (category.parentId) {
      const parentCategory = await this.categoryRepository.findById(category.parentId);
      if (!parentCategory) {
        return fail(new CategoryNotFoundError(category.parentId));
      }
    }

    // 4. Lưu vào Repository
    const savedCategory = await this.categoryRepository.save(category);

    return ok({
      id: savedCategory.id,
      parentId: savedCategory.parentId,
      name: savedCategory.name,
      slug: savedCategory.slug,
      description: savedCategory.description,
      image: savedCategory.image,
      isActive: savedCategory.isActive,
      createdAt: savedCategory.createdAt.toISOString(),
      updatedAt: savedCategory.updatedAt.toISOString(),
    });
  }
}
