import { Cart } from "../../domain/entities/Cart";
import { CartItem } from "../../domain/entities/CartItem";

export class RedisCartMapper {
  public static toRedisJson(cart: Cart): string {
    return JSON.stringify({
      id: cart.id,
      userId: cart.userId,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
      items: cart.items.map((item) => ({
        id: item.id,
        cartId: item.cartId,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })),
    });
  }
  public static toDomain(jsonString: string): Cart {
    const raw = JSON.parse(jsonString);

    const items = (raw.items || []).map(
      (item: any) =>
        new CartItem({
          id: item.id,
          cartId: item.cartId,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price ?? 0,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
        }),
    );

    return new Cart({
      id: raw.id,
      userId: raw.userId,
      items,
      createdAt: new Date(raw.createdAt),
      updatedAt: new Date(raw.updatedAt),
    });
  }
}
