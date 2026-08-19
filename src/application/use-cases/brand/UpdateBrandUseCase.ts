import { IBrandRepository } from "../../../domain/repositories/IBrandRepository";
import { BrandResponseDto } from "../../dtos/brand/createBrandDto";
import { updateBrandDto } from "../../dtos/brand/UpdateBrandDto";
import { BrandNotFoundError } from "../../../domain/errors/Brand/BrandNotFoundError";
import { DuplicateBrandNameError } from "../../../domain/errors/Brand/DuplicateBrandNameError";
import { DomainError } from "../../../domain/errors/DomainError";
import { Result, ok, fail } from "../../../domain/common/Result";

export class UpdateBrandUseCase {
  constructor(private readonly brandRepository: IBrandRepository) {}

  async execute(dto: updateBrandDto): Promise<Result<BrandResponseDto, DomainError>> {
    const brand = await this.brandRepository.findById(dto.id);
    if (!brand) {
      return fail(new BrandNotFoundError(dto.id));
    }

    if (dto.name !== undefined && dto.name.trim() !== "" && dto.name.trim() !== brand.name) {
      const existingBrand = await this.brandRepository.findByName(dto.name.trim());
      if (existingBrand && existingBrand.id !== brand.id) {
        return fail(new DuplicateBrandNameError(dto.name.trim()));
      }
    }

    const updateResult = brand.update({
      id: dto.id,
      name: dto.name,
      description: dto.description,
      logo: dto.logo,
      isActive: dto.isActive !== undefined ? dto.isActive : brand.isActive,
    });

    if (updateResult.isFailure) {
      return fail(updateResult.error);
    }

    const updateBrand = await this.brandRepository.save(brand);

    return ok({
      id: updateBrand.id,
      name: updateBrand.name,
      description: updateBrand.description,
      logo: updateBrand.logo,
      isActive: updateBrand.isActive,
      createdAt: updateBrand.createdAt.toISOString(),
      updatedAt: updateBrand.updatedAt.toISOString(),
    });
  }
}