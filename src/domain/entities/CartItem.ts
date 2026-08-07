import { Entity } from "../common/Entity";

export interface CartItemProps {
  id?: string;
  cartId: string;
  productId: string;
  quantity: number;
  price: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export class CartItem extends Entity {
  private readonly _cartId: string;
  private readonly _productId: string;
  private _quantity: number;
  private _price: number;

  constructor(props: CartItemProps) {
    super(props.id, props.createdAt, props.updatedAt, props.deletedAt);

    if (!props.cartId || props.cartId.trim().length === 0) {
      throw new Error("Mã giỏ hàng (cartId) không được để trống.");
    }
    if (!props.productId || props.productId.trim().length === 0) {
      throw new Error("Mã sản phẩm (productId) không được để trống.");
    }
    if (props.quantity <= 0) {
      throw new Error("Số lượng sản phẩm phải lớn hơn 0.");
    }
    if (props.price === undefined || props.price === null || props.price < 0) {
      throw new Error("Giá sản phẩm không được nhỏ hơn 0.");
    }

    this._cartId = props.cartId;
    this._productId = props.productId;
    this._quantity = props.quantity;
    this._price = props.price;
  }

  public static create(props: {
    cartId: string;
    productId: string;
    quantity: number;
    price: number;
  }): CartItem {
    return new CartItem(props);
  }

  public get cartId(): string {
    return this._cartId;
  }

  public get productId(): string {
    return this._productId;
  }

  public get quantity(): number {
    return this._quantity;
  }

  public get price(): number {
    return this._price;
  }

  // Cập nhật giá sản phẩm trong giỏ hàng
  public updatePrice(newPrice: number): void {
    if (newPrice < 0) {
      throw new Error("Giá sản phẩm không được nhỏ hơn 0.");
    }
    this._price = newPrice;
    this.touch();
  }

  //cập nhật số lượng sản phẩm trong giỏ hàng
  public updateQuantity(newQuantity: number): void {
    if (newQuantity <= 0) {
      throw new Error("Số lượng sản phẩm phải lớn hơn 0.");
    }
    this._quantity = newQuantity;
    this.touch();
  }
  //cộng số lượng sản phẩm trong giỏ hàng
  public increaseQuantity(amount: number): void {
    if (amount <= 0) {
      throw new Error("Số lượng cộng thêm phải lớn hơn 0.");
    }
    this._quantity += amount;
    this.touch();
  }
}
