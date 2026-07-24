import { IBrandRepository } from "../../../domain/repositories/IBrandRepository";
import { BrandResponseDto } from "../../dtos/brand/createBrandDto";

export class GetBrandByIdUseCase{
    constructor(private readonly brandRepository:IBrandRepository){}
    async execute(id:string):Promise<BrandResponseDto>{
        const brand=await this.brandRepository.findById(id);
        if(!brand){
            throw new Error("Thương hiệu không tồn tại");
        }
        return{
            id:brand.id,
            name:brand.name,
            logo:brand.logo,
            description:brand.description,
            isActive:brand.isActive,
            createdAt:brand.createdAt.toISOString(),
            updatedAt:brand.updatedAt.toISOString(),
        }
    }
}