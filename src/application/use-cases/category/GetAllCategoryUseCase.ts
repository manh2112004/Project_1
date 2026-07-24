import { ICategoryRepository } from '../../../domain/repositories/ICategoryRepository';
export class GetAllCategoryUseCase {
  constructor(private readonly categoryRepository: ICategoryRepository) { }
  async execute():Promise<any[]>{
    const categories=await this.categoryRepository.findAll();
    return categories.map((category)=>({
      id:category.id,
      parentId:category.parentId,
      name:category.name,
      slug:category.slug,
      description:category.description,
      image:category.image,
      isActive:category.isActive,
      createdAt:category.createdAt.toISOString(),
      updatedAt:category.updatedAt.toISOString(),
    }))
  }
}