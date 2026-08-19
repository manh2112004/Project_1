import { IBrandRepository } from "../../../domain/repositories/IBrandRepository";
import { BrandResponseDto } from "../../dtos/brand/createBrandDto";
import { DomainError } from "../../../domain/errors/DomainError";
import { Result, ok } from "../../../domain/common/Result";

export interface PaginatedBrandsResponse {
  brands: BrandResponseDto[];
  meta: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

export class GetBrandsPaginatedUseCase {
  constructor(private readonly brandRepository: IBrandRepository) {}

  async execute(
    page: number,
    limit: number,
    search?: string
  ): Promise<Result<PaginatedBrandsResponse, DomainError>> {
    const validPage = page > 0 ? page : 1;
    const validLimit = limit > 0 ? limit : 1;
    const { brands, totalCount } = await this.brandRepository.findAndCount(
      validPage,
      validLimit,
      search
    );
    const totalPages = Math.ceil(totalCount / validLimit);

    return ok({
      brands: brands.map((brand) => ({
        id: brand.id,
        name: brand.name,
        description: brand.description,
        logo: brand.logo,
        isActive: brand.isActive,
        createdAt: brand.createdAt.toISOString(),
        updatedAt: brand.updatedAt.toISOString(),
      })),
      meta: {
        totalCount,
        totalPages,
        currentPage: validPage,
        limit: validLimit,
      },
    });
  }
}
