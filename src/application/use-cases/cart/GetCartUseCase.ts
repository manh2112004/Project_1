// src/application/use-cases/cart/GetCartUseCase.ts
import { Cart } from "../../../domain/entities/Cart";
import { ICartRepository } from "../../../domain/repositories/ICartRepository";

export class GetCartUseCase {
  constructor(private readonly cartRepository: ICartRepository) {}

  async execute(userId: string): Promise<Cart> {
    let cart = await this.cartRepository.findByUserId(userId);
    if (!cart) {
      cart = Cart.create({ userId });
    }

    return cart;
  }
}
