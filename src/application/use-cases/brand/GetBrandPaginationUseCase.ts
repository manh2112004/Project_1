import { IBrandRepository } from "../../../domain/repositories/IBrandRepository";
import { BrandResponseDto } from "../../dtos/brand/createBrandDto";

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
  async execute(page: number, limit: number): Promise<PaginatedBrandsResponse> {
    const validPage = page > 0 ? page : 1;
    const validLimit = limit > 0 ? limit : 1;
    const { brands, totalCount } = await this.brandRepository.findAndCount(
      validPage,
      validLimit,
    );
    const totalPages = Math.ceil(totalCount / validLimit);
    return {
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
    };
  }
}
