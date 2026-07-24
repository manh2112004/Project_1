import { IBrandRepository } from "../../../domain/repositories/IBrandRepository";
import { BrandResponseDto } from "../../dtos/brand/createBrandDto";
import { updateBrandDto } from "../../dtos/brand/UpdateBrandDto";

export class UpdateBrandUseCase{
    constructor(private readonly brandRepository:IBrandRepository){}
    async execute(dto:updateBrandDto):Promise<BrandResponseDto>{
        const brand=await this.brandRepository.findById(dto.id);
        if(!brand){
            throw new Error("thương hiệu chưa tồn tại")
        }
        brand.update({
            id: dto.id,
            name: dto.name,
            description: dto.description,
            logo: dto.logo,
            isActive: dto.isActive !== undefined ? dto.isActive : brand.isActive
        })
        const updateBrand=await this.brandRepository.save(brand);
        return{
            id: updateBrand.id,
            name: updateBrand.name,
            description: updateBrand.description,
            logo: updateBrand.logo,
            isActive: updateBrand.isActive,
            createdAt: updateBrand.createdAt.toISOString(),
            updatedAt: updateBrand.updatedAt.toISOString()
        }
    }
}