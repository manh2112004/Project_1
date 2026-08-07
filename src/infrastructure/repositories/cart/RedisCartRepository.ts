import { Redis } from "ioredis";
import { ICartRepository } from "../../../domain/repositories/ICartRepository";
import { Cart } from "../../../domain/entities/Cart";
import { RedisCartMapper } from "../../mappers/RedisCartMapper";

export class RedisCartRepository implements ICartRepository {
  // Đặt thời gian hết hạn giỏ hàng
  private readonly CART_TTL_SECONDS = 30 * 24 * 60 * 60;

  constructor(private readonly redis: Redis) {}

  /** Đặt tên Key chuẩn trong Redis: cart:user:<userId> */
  private getCartKey(userId: string): string {
    return `cart:user:${userId}`;
  }

  async save(cart: Cart): Promise<Cart> {
    const key = this.getCartKey(cart.userId);
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
    // Với Redis, ta thường query theo userId để tối ưu tốc độ O(1)
    // Nếu muốn tìm theo id, ta có thể lưu thêm index key "cart:id:<id>" -> userId
    throw new Error(
      "Khuyến nghị dùng findByUserId đối với Redis Cart Repository.",
    );
  }

  async delete(id: string): Promise<void> {
    // Triển khai xóa theo id nếu cần
  }

  async clearByUserId(userId: string): Promise<void> {
    const key = this.getCartKey(userId);
    await this.redis.del(key);
  }
}
