import { Cart } from "../../../domain/entities/Cart";
import { ICartRepository } from "../../../domain/repositories/ICartRepository";

export interface UpdateCartItemQuantityDto {
  userId: string;
  productId: string;
  quantity: number;
}

export class UpdateCartItemQuantityUseCase {
  constructor(private readonly cartRepository: ICartRepository) {}

  async execute(dto: UpdateCartItemQuantityDto): Promise<Cart> {
    const cart = await this.cartRepository.findByUserId(dto.userId);

    if (!cart) {
      throw new Error("Giỏ hàng của người dùng không tồn tại.");
    }

    // Cập nhật số lượng sản phẩm (Domain method sẽ tự động xóa nếu quantity <= 0)
    cart.updateItemQuantity(dto.productId, dto.quantity);

    return await this.cartRepository.save(cart);
  }
}
