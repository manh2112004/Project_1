import { IBrandRepository } from "../../../domain/repositories/IBrandRepository";
import { BrandNotFoundError } from "../../../domain/errors/Brand/BrandNotFoundError";
import { DomainError } from "../../../domain/errors/DomainError";
import { Result, ok, fail } from "../../../domain/common/Result";

export class DeleteBrandUseCase {
  constructor(private readonly brandRepository: IBrandRepository) {}

  async execute(id: string): Promise<Result<void, DomainError>> {
    const brand = await this.brandRepository.findById(id);
    if (!brand) {
      return fail(new BrandNotFoundError(id));
    }

    brand.delete();
    await this.brandRepository.save(brand);

    return ok(undefined);
  }
}