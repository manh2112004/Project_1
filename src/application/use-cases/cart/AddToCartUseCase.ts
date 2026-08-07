// src/application/use-cases/cart/AddToCartUseCase.ts
import { Cart } from "../../../domain/entities/Cart";
import { ICartRepository } from "../../../domain/repositories/ICartRepository";

export interface AddToCartDto {
  userId: string;
  productId: string;
  quantity: number;
  price: number;
}

export class AddToCartUseCase {
  constructor(private readonly cartRepository: ICartRepository) {}

  async execute(dto: AddToCartDto): Promise<Cart> {
    // 1. Lấy giỏ hàng hiện tại của user từ Repository (đã đấu nối với Redis)
    let cart = await this.cartRepository.findByUserId(dto.userId);

    // 2. Nếu user chưa có giỏ hàng -> Tạo giỏ hàng mới
    if (!cart) {
      cart = Cart.create({ userId: dto.userId });
    }

    // 3. Thực hiện nghiệp vụ thêm sản phẩm vào giỏ (gọi phương thức Domain)
    cart.addItem(dto.productId, dto.quantity, dto.price);

    // 4. Lưu giỏ hàng đã cập nhật vào Repository (Redis)
    return await this.cartRepository.save(cart);
  }
}
