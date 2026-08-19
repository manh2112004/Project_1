import { IBrandRepository } from "../../../domain/repositories/IBrandRepository";
import { BrandResponseDto } from "../../dtos/brand/createBrandDto";
import { DomainError } from "../../../domain/errors/DomainError";
import { Result, ok } from "../../../domain/common/Result";

export class GetAllBrandUseCase {
  constructor(private readonly brandRepository: IBrandRepository) {}

  async execute(): Promise<Result<BrandResponseDto[], DomainError>> {
    const brands = await this.brandRepository.findAll();
    const data = brands.map((brand) => ({
      id: brand.id,
      name: brand.name,
      logo: brand.logo,
      description: brand.description,
      isActive: brand.isActive,
      createdAt: brand.createdAt.toISOString(),
      updatedAt: brand.updatedAt.toISOString(),
    }));

    return ok(data);
  }
}
