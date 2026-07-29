import { Product } from "../entities/Product";

export interface IProductRepository {
  save(product: Product): Promise<Product>;
  findById(id: string): Promise<Product | null>;
  findBySku(sku: string): Promise<Product | null>;
  findBySlug(slug: string): Promise<Product | null>;
  delete(id: string): Promise<void>;
  findAll(): Promise<Product[]>;
  findByCategoryId(categoryId: string): Promise<Product[]>;
  findAndCount(
    page: number,
    limit: number,
    search: string,
  ): Promise<{ products: Product[]; totalCount: number }>;
  searchByNameOrSlug(search?: string): Promise<Product[]>;
}
