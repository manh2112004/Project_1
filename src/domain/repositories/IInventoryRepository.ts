import { Inventory } from "../entities/Inventory";

export interface IInventoryRepository {
  save(inventory: Inventory): Promise<Inventory>;
  findById(id: string): Promise<Inventory | null>;
  findByProductId(productId: string): Promise<Inventory | null>;
  findAll(): Promise<Inventory[]>;
}
