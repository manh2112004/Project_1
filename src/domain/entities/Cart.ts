import { AggregateRoot } from "../common/AggregateRoot";
import { CartItem } from "./CartItem";

export interface CartProps {
  id?: string;
  userId: string;
  items?: CartItem[];
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export class Cart extends AggregateRoot {
  private _userId: string;
  private _items: CartItem[];

  constructor(props: CartProps) {
    super(props.id, props.createdAt, props.updatedAt, props.deletedAt);

    if (!props.userId || props.userId.trim().length === 0) {
      throw new Error("Mã người dùng (userId) không được để trống.");
    }

    this._userId = props.userId;
    this._items = props.items || [];
  }

  public static create(props: { userId: string }): Cart {
    return new Cart({
      userId: props.userId,
      items: [],
    });
  }

  // Getters
  public get userId(): string {
    return this._userId;
  }
  public get items(): ReadonlyArray<CartItem> {
    return this._items;
  }

  public get totalItems(): number {
    return this._items.reduce((total, item) => total + item.quantity, 0);
  }

  public get isEmpty(): boolean {
    return this._items.length === 0;
  }

  public addItem(productId: string, quantity: number, price: number): void {
    const existingItem = this._items.find(
      (item) => item.productId === productId,
    );

    if (existingItem) {
      existingItem.increaseQuantity(quantity);
      existingItem.updatePrice(price);
    } else {
      const newItem = CartItem.create({
        cartId: this.id,
        productId,
        quantity,
        price,
      });
      this._items.push(newItem);
    }
    this.touch();
  }

  public updateItemQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }

    const item = this._items.find((i) => i.productId === productId);
    if (!item) {
      throw new Error("Sản phẩm không có trong giỏ hàng.");
    }

    item.updateQuantity(quantity);
    this.touch();
  }
  //Xóa một sản phẩm cụ thể khỏi giỏ hàng.
  public removeItem(productId: string): void {
    this._items = this._items.filter((item) => item.productId !== productId);
    this.touch();
  }
  //Xóa sạch toàn bộ giỏ hàng.
  public clear(): void {
    this._items = [];
    this.touch();
  }
}
