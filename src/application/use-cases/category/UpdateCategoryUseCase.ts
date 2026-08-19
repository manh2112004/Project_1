import { Category } from "../../../domain/entities/Category";
import { CategoryNotFoundError } from "../../../domain/errors/category/CategoryNotFoundError";
import { DuplicateSlugError } from "../../../domain/errors/category/DuplicateSlugError";
import { InvalidParentIdError } from "../../../domain/errors/category/InvalidParentIdError";
import { DomainError } from "../../../domain/errors/DomainError";
import { Result, ok, fail } from "../../../domain/common/Result";
import { ICategoryRepository } from "../../../domain/repositories/ICategoryRepository";
import { CategoryResponseDto } from "../../dtos/category/CreateCategoryDto";
import { UpdateCategoryDto } from "../../dtos/category/UpdateCategoryDto";

export class UpdateCategoryUseCase {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async execute(dto: UpdateCategoryDto): Promise<Result<CategoryResponseDto, DomainError>> {
    const category = await this.categoryRepository.findById(dto.id);
    if (!category) {
      return fail(new CategoryNotFoundError(dto.id));
    }

    let targetSlug = category.slug;
    if (dto.name !== undefined) {
      if (!dto.name || dto.name.trim() === "") {
        return fail(new DomainError("Tên danh mục không được để trống.", 400, "INVALID_CATEGORY_NAME"));
      }
      targetSlug = dto.slug && dto.slug.trim() !== '' ? Category.slugify(dto.slug) : Category.slugify(dto.name);
    } else if (dto.slug !== undefined && dto.slug.trim() !== '') {
      targetSlug = Category.slugify(dto.slug);
    }

    if (targetSlug !== category.slug) {
      const existingSlug = await this.categoryRepository.findBySlug(targetSlug);
      if (existingSlug && existingSlug.id !== category.id) {
        return fail(new DuplicateSlugError(targetSlug));
      }
    }

    if (dto.parentId !== undefined && dto.parentId !== null) {
      if (dto.parentId === category.id) {
        return fail(new InvalidParentIdError("parentId không được trùng với id của chính nó."));
      }
      const parentCategory = await this.categoryRepository.findById(dto.parentId);
      if (!parentCategory) {
        return fail(new CategoryNotFoundError(dto.parentId));
      }
    }

    const updateResult = category.update({
      id: dto.id,
      name: dto.name,
      slug: targetSlug,
      parentId: dto.parentId,
      description: dto.description,
      image: dto.image,
      isActive: dto.isActive !== undefined ? dto.isActive : category.isActive,
    });

    if (updateResult.isFailure) {
      return fail(updateResult.error);
    }

    const updateCategory = await this.categoryRepository.save(category);

    return ok({
      id: updateCategory.id,
      parentId: updateCategory.parentId,
      name: updateCategory.name,
      slug: updateCategory.slug,
      description: updateCategory.description,
      image: updateCategory.image,
      isActive: updateCategory.isActive,
      createdAt: updateCategory.createdAt.toISOString(),
      updatedAt: updateCategory.updatedAt.toISOString(),
    });
  }
}