import { Cart } from "../entities/Cart";

export interface ICartRepository {
  save(cart: Cart): Promise<Cart>;
  findById(id: string): Promise<Cart | null>;
  findByUserId(userId: string): Promise<Cart | null>;
  delete(id: string): Promise<void>;
  clearByUserId(userId: string): Promise<void>;
}
