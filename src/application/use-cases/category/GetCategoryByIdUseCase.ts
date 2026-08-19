import { ICategoryRepository } from "../../../domain/repositories/ICategoryRepository";
import { CategoryResponseDto } from "../../dtos/category/CreateCategoryDto";
import { CategoryNotFoundError } from "../../../domain/errors/category/CategoryNotFoundError";
import { DomainError } from "../../../domain/errors/DomainError";
import { Result, ok, fail } from "../../../domain/common/Result";

export class GetCategoryByIdUseCase {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async execute(id: string): Promise<Result<CategoryResponseDto, DomainError>> {
    const category = await this.categoryRepository.findById(id);
    if (!category || category.isActive === false) {
      return fail(new CategoryNotFoundError(id));
    }

    return ok({
      id: category.id,
      parentId: category.parentId,
      name: category.name,
      slug: category.slug,
      description: category.description,
      image: category.image,
      isActive: category.isActive,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
    });
  }
}