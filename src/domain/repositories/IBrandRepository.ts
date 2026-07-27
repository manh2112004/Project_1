import { Brand } from "../entities/Brand";
export interface IBrandRepository {
  save(brand: Brand): Promise<Brand>;
  findById(id: string): Promise<Brand | null>;
  findByName(name: string): Promise<Brand | null>;
  delete(id: string): Promise<void>;
  findAll(): Promise<Brand[]>;
  findAndCount(
    page: number,
    limit: number,
  ): Promise<{ brands: Brand[]; totalCount: number }>;
}
