import { Redis } from "ioredis";
import { ICartRepository } from "../../../domain/repositories/ICartRepository";
import { Cart } from "../../../domain/entities/Cart";
import { RedisCartMapper } from "../../mappers/RedisCartMapper";

export class RedisCartRepository implements ICartRepository {
  // Đặt thời gian hết hạn giỏ hàng (30 ngày)
  private readonly CART_TTL_SECONDS = 30 * 24 * 60 * 60;

  constructor(private readonly redis: Redis) { }

  /** Đặt tên Key chuẩn trong Redis: cart:user:<userId> */
  private getCartKey(userId: string): string {
    return `cart:user:${userId}`;
  }

  async save(cart: Cart): Promise<Cart> {
    const key = this.getCartKey(cart.userId);

    // ⚡ TỐI ƯU BỘ NHỚ REDIS:
    // Nếu giỏ hàng rỗng (không còn sản phẩm nào) -> Xóa hẳn Key khỏi Redis
    if (cart.isEmpty || cart.items.length === 0) {
      await this.redis.del(key);
      return cart;
    }

    const jsonData = RedisCartMapper.toRedisJson(cart);

    // Lưu vào Redis kèm thời gian hết hạn (EX)
    await this.redis.set(key, jsonData, "EX", this.CART_TTL_SECONDS);

    return cart;
  }

  async findByUserId(userId: string): Promise<Cart | null> {
    const key = this.getCartKey(userId);
    const jsonData = await this.redis.get(key);

    if (!jsonData) {
      return null;
    }

    return RedisCartMapper.toDomain(jsonData);
  }

  async findById(id: string): Promise<Cart | null> {
    throw new Error(
      "Khuyến nghị dùng findByUserId đối với Redis Cart Repository."
    );
  }

  async delete(userId: string): Promise<void> {
    await this.clearByUserId(userId);
  }

  async clearByUserId(userId: string): Promise<void> {
    const key = this.getCartKey(userId);
    await this.redis.del(key);
  }
}
