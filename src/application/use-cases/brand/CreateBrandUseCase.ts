import { IBrandRepository } from "../../../domain/repositories/IBrandRepository";
import { BrandResponseDto, createBrandDto } from "../../dtos/brand/createBrandDto";
import { Brand } from "../../../domain/entities/Brand";
import { DuplicateBrandNameError } from "../../../domain/errors/Brand/DuplicateBrandNameError";
import { DomainError } from "../../../domain/errors/DomainError";
import { Result, ok, fail } from "../../../domain/common/Result";

export class CreateBrandUseCase {
  constructor(private readonly brandRepository: IBrandRepository) {}

  async execute(dto: createBrandDto): Promise<Result<BrandResponseDto, DomainError>> {
    const brandResult = Brand.create({
      name: dto.name,
      description: dto.description ?? null,
      logo: dto.logo ?? null,
      isActive: dto.isActive,
    });

    if (brandResult.isFailure) {
      return fail(brandResult.error);
    }

    const brand = brandResult.value;

    const existingBrand = await this.brandRepository.findByName(brand.name);
    if (existingBrand) {
      return fail(new DuplicateBrandNameError(brand.name));
    }

    const savedBrand = await this.brandRepository.save(brand);

    return ok({
      id: savedBrand.id,
      name: savedBrand.name,
      description: savedBrand.description,
      logo: savedBrand.logo,
      isActive: savedBrand.isActive,
      createdAt: savedBrand.createdAt.toISOString(),
      updatedAt: savedBrand.updatedAt.toISOString(),
    });
  }
}