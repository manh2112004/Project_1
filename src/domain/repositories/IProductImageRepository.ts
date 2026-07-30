import { ProductImage } from "../entities/ProductImage";

export interface IProductImageRepository {
  save(productImage: ProductImage): Promise<ProductImage>;
  findById(id: string): Promise<ProductImage | null>;
  findByProductId(productId: string): Promise<ProductImage[]>;
  findAll(): Promise<ProductImage[]>;
}
