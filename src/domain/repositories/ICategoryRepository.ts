import { Category } from '../entities/Category';

export interface ICategoryRepository {
  save(category: Category): Promise<Category>;
  findById(id: string): Promise<Category | null>;
  findBySlug(slug: string): Promise<Category | null>;
  findByName(name: string): Promise<Category | null>;
  delete(id: string): Promise<void>;
  findAll():Promise<Category[]>;
}
