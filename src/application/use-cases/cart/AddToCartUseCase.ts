import { Cart } from "../../../domain/entities/Cart";
import { ICartRepository } from "../../../domain/repositories/ICartRepository";
import { IProductRepository } from "../../../domain/repositories/IProductRepository";

export interface AddToCartDto {
  userId: string;
  productId: string;
  quantity: number;
  price: number;
}

export class AddToCartUseCase {
  constructor(
    private readonly cartRepository: ICartRepository,
    private readonly productRepository?: IProductRepository,
  ) {}

  async execute(dto: AddToCartDto): Promise<Cart> {
    if (this.productRepository) {
      const product = await this.productRepository.findById(dto.productId);
      if (!product) {
        throw new Error("Sản phẩm không còn tồn tại trên hệ thống.");
      }
      if (product.status === "INACTIVE") {
        throw new Error("Sản phẩm này hiện đang tạm ngưng kinh doanh.");
      }
      if (product.store && (product.store.isOnVacation || product.store.status !== "ACTIVE")) {
        throw new Error(
          `Gian hàng "${product.store.name}" đang trong thời gian tạm nghỉ bán, không thể thêm sản phẩm vào giỏ hàng.`
        );
      }
    }

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
