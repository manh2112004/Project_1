import { ICategoryRepository } from "../../../domain/repositories/ICategoryRepository";
import {CategoryResponseDto } from "../../dtos/category/CreateCategoryDto";
export class GetCategoryByIdUseCase{
    constructor(private readonly categoryRepository:ICategoryRepository){}
    async execute(id:string):Promise<CategoryResponseDto>{
        const category=await this.categoryRepository.findById(id);
        if(!category|| category.isActive===false){
            throw new Error('Danh mục không tồn tại hoặc đã bị xóa');
        }
        return {
            id:category.id,
            parentId:category.parentId,
            name:category.name,
            slug:category.slug,
            description:category.description,
            image:category.image,
            isActive:category.isActive,
            createdAt:category.createdAt.toISOString(),
            updatedAt:category.updatedAt.toISOString(),
        }
    }
}