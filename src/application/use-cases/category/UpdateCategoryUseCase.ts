import { Category } from "../../../domain/entities/Category";
import { CategoryNotFoundError } from "../../../domain/errors/category/CategoryNotFoundError";
import { ICategoryRepository } from "../../../domain/repositories/ICategoryRepository";
import { CategoryResponseDto } from "../../dtos/category/CreateCategoryDto";
import { UpdateCategoryDto } from "../../dtos/category/UpdateCategoryDto";

export class UpdateCategoryUseCase {
    constructor(private readonly categoryRepository: ICategoryRepository) { }
    async execute(dto: UpdateCategoryDto): Promise<CategoryResponseDto> {

        
        const category = await this.categoryRepository.findById(dto.id);
        if (!category) {
            throw new CategoryNotFoundError(dto.id);
        }
        let targetSlug = category.slug;
        if (dto.name !== undefined) {
            if (!dto.name || dto.name.trim() === "") {
                throw new Error("tên danh mục không được để trống ")
            }
            targetSlug = dto.slug && dto.slug.trim() !== '' ? Category.slugify(dto.slug) : Category.slugify(dto.name);
        }
        else if (dto.slug != undefined && dto.slug.trim() !== '') {
            targetSlug = Category.slugify(dto.slug);
        }
        if (targetSlug !== category.slug) {
            const exitingSlug = await this.categoryRepository.findBySlug(targetSlug);
            if (exitingSlug && exitingSlug.id !== category.id) {
                throw new Error("slug này đã được sử dụng")
            }

        }
        if (dto.parentId !== undefined && dto.parentId !== null) {
            if (dto.parentId === category.id) {
                throw new Error("parentId không được trùng với id của chính nó")
            }
            const parentCategory = await this.categoryRepository.findById(dto.parentId);
            if (!parentCategory) {
                throw new Error("không tìm thấy danh mục cha")
            }
        }
        //caapk nhật bên domain entity
        category.update({
            id: dto.id,
            name: dto.name,
            slug: targetSlug,
            parentId: dto.parentId,
            description: dto.description,
            image: dto.image,
            isActive: dto.isActive !== undefined ? dto.isActive : category.isActive
        })
        //lưu vào repository
        const updateCategory = await this.categoryRepository.save(category);
        //trả về response dto
        return {
            id: updateCategory.id,
            parentId: updateCategory.parentId,
            name: updateCategory.name,
            slug: updateCategory.slug,
            description: updateCategory.description,
            image: updateCategory.image,
            isActive: updateCategory.isActive,
            createdAt: updateCategory.createdAt.toISOString(),
            updatedAt: updateCategory.updatedAt.toISOString()
        }
    }
}