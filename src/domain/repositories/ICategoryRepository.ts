import { Category } from "../entities/Category";

export interface ICategoryRepository {
  save(category: Category): Promise<Category>;
  findById(id: string): Promise<Category | null>;
  findBySlug(slug: string): Promise<Category | null>;
  findByName(name: string): Promise<Category | null>;
  delete(id: string): Promise<void>;
  findAll(): Promise<Category[]>;
  findAndCount(
    page: number,
    limit: number,
    search?: string,
  ): Promise<{ categories: Category[]; totalCount: number }>;
}
