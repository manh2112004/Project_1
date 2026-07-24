import { Category } from '../../../domain/entities/Category';
import { ICategoryRepository } from '../../../domain/repositories/ICategoryRepository';
import { CreateCategoryDto, CategoryResponseDto } from '../../dtos/category/CreateCategoryDto';

export class CreateCategoryUseCase {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async execute(dto: CreateCategoryDto): Promise<CategoryResponseDto> {
    if (!dto.name || dto.name.trim() === '') {
      throw new Error('Tên danh mục (name) là bắt buộc.');
    }

    // Tự tạo slug nếu không truyền vào
    const targetSlug = dto.slug && dto.slug.trim() !== ''
      ? Category.slugify(dto.slug)
      : Category.slugify(dto.name);

    // Kiểm tra trùng lặp slug
    const existingSlug = await this.categoryRepository.findBySlug(targetSlug);
    if (existingSlug) {
      throw new Error(`Slug '${targetSlug}' đã tồn tại.`);
    }

    // Nếu truyền parentId, kiểm tra parentId có tồn tại hay không
    if (dto.parentId) {
      const parentCategory = await this.categoryRepository.findById(dto.parentId);
      if (!parentCategory) {
        throw new Error(`Danh mục cha với ID '${dto.parentId}' không tồn tại.`);
      }
    }

    // Tạo Domain Entity
    const category = Category.create({
      name: dto.name,
      slug: targetSlug,
      parentId: dto.parentId,
      description: dto.description,
      image: dto.image,
      isActive: dto.isActive,
    });

    // Lưu vào Repository
    const savedCategory = await this.categoryRepository.save(category);

    return {
      id: savedCategory.id,
      parentId: savedCategory.parentId,
      name: savedCategory.name,
      slug: savedCategory.slug,
      description: savedCategory.description,
      image: savedCategory.image,
      isActive: savedCategory.isActive,
      createdAt: savedCategory.createdAt.toISOString(),
      updatedAt: savedCategory.updatedAt.toISOString(),
    };
  }
}
