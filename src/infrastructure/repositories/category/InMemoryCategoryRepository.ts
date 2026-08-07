import { Category } from '../../../domain/entities/Category';
import { ICategoryRepository } from '../../../domain/repositories/ICategoryRepository';

export class InMemoryCategoryRepository implements ICategoryRepository {
  private categories: Category[] = [];

  async save(category: Category): Promise<Category> {
    const index = this.categories.findIndex((c) => c.id === category.id);
    if (index >= 0) {
      this.categories[index] = category;
    } else {
      this.categories.push(category);
    }
    return category;
  }

  async findById(id: string): Promise<Category | null> {
    return this.categories.find((c) => c.id === id && !c.deletedAt) || null;
  }

  async findBySlug(slug: string): Promise<Category | null> {
    return this.categories.find((c) => c.slug === slug && !c.deletedAt) || null;
  }

  async findByName(name: string): Promise<Category | null> {
    return this.categories.find((c) => c.name.toLowerCase() === name.toLowerCase() && !c.deletedAt) || null;
  }
    delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  async findAll(): Promise<Category[]> {
    return this.categories.filter((c) => !c.deletedAt);
  }

  async findAndCount(page: number, limit: number, search?: string): Promise<{ categories: Category[]; totalCount: number }> {
    let filtered = this.categories.filter((c) => !c.deletedAt);
    if (search) {
      filtered = filtered.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));
    }
    const totalCount = filtered.length;
    const startIndex = (page - 1) * limit;
    const categories = filtered.slice(startIndex, startIndex + limit);
    return { categories, totalCount };
  }
}
