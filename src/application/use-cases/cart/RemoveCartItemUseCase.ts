import { Cart } from "../../../domain/entities/Cart";
import { ICartRepository } from "../../../domain/repositories/ICartRepository";

export interface RemoveCartItemDto {
  userId: string;
  productId: string;
}

export class RemoveCartItemUseCase {
  constructor(private readonly cartRepository: ICartRepository) {}

  async execute(dto: RemoveCartItemDto): Promise<Cart> {
    const cart = await this.cartRepository.findByUserId(dto.userId);

    if (!cart) {
      throw new Error("Giỏ hàng của người dùng không tồn tại.");
    }

    // Xóa sản phẩm chỉ định ra khỏi giỏ
    cart.removeItem(dto.productId);

    return await this.cartRepository.save(cart);
  }
}
