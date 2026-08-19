import { IBrandRepository } from "../../../domain/repositories/IBrandRepository";
import { BrandResponseDto } from "../../dtos/brand/createBrandDto";
import { BrandNotFoundError } from "../../../domain/errors/Brand/BrandNotFoundError";
import { DomainError } from "../../../domain/errors/DomainError";
import { Result, ok, fail } from "../../../domain/common/Result";

export class GetBrandByIdUseCase {
  constructor(private readonly brandRepository: IBrandRepository) {}

  async execute(id: string): Promise<Result<BrandResponseDto, DomainError>> {
    const brand = await this.brandRepository.findById(id);
    if (!brand || brand.isActive === false) {
      return fail(new BrandNotFoundError(id));
    }

    return ok({
      id: brand.id,
      name: brand.name,
      logo: brand.logo,
      description: brand.description,
      isActive: brand.isActive,
      createdAt: brand.createdAt.toISOString(),
      updatedAt: brand.updatedAt.toISOString(),
    });
  }
}