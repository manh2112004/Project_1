import { ICategoryRepository } from "../../../domain/repositories/ICategoryRepository";
import { CategoryResponseDto } from "../../dtos/category/CreateCategoryDto";

export interface PaginatedCategoriesResponse {
  categories: CategoryResponseDto[];
  meta: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}
export class GetCategoriesPaginatedUseCase {
  constructor(private readonly categoryRepository: ICategoryRepository) {}
  async execute(
    page: number,
    limit: number,
    search?: string,
  ): Promise<PaginatedCategoriesResponse> {
    const validPage = page > 0 ? page : 1;
    const validLimit = limit > 0 ? limit : 1;
    const { categories, totalCount } =
      await this.categoryRepository.findAndCount(validPage, validLimit, search);
    const totalPages = Math.ceil(totalCount / validLimit);
    return {
      categories: categories.map((category) => ({
        id: category.id,
        parentId: category.parentId,
        name: category.name,
        slug: category.slug,
        description: category.description,
        image: category.image,
        isActive: category.isActive,
        createdAt: category.createdAt.toISOString(),
        updatedAt: category.updatedAt.toISOString(),
      })),
      meta: {
        totalCount,
        totalPages,
        currentPage: validPage,
        limit: validLimit,
      },
    };
  }
}
