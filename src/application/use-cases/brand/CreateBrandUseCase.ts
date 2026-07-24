import { IBrandRepository } from "../../../domain/repositories/IBrandRepository";
import { BrandResponseDto, createBrandDto } from "../../dtos/brand/createBrandDto";
import { Brand } from "../../../domain/entities/Brand";
export class CreateBrandUseCase {
    constructor(private readonly brandRepository: IBrandRepository) { }
    async execute(dto: createBrandDto): Promise<BrandResponseDto> {
        if (!dto.name || dto.name.trim() === '') {
            throw new Error('Tên thương hiệu (name) là bắt buộc.');
        }
        const exitsingBrand = await this.brandRepository.findByName(dto.name);
        if (exitsingBrand) {
            throw new Error(`Thương hiệu với tên '${dto.name}' đã tồn tại.`);
        }
        const brand = new Brand({
            name: dto.name,
            description: dto.description,
            logo: dto.logo ?? null,
            isActive: dto.isActive !== undefined ? dto.isActive : true
        })
        const savedBrand = await this.brandRepository.save(brand);
        return {
            id: savedBrand.id,
            name: savedBrand.name,
            description: savedBrand.description,
            logo: savedBrand.logo,
            isActive: savedBrand.isActive,
            createdAt: savedBrand.createdAt.toISOString(),
            updatedAt: savedBrand.updatedAt.toISOString()
        }
    }
}