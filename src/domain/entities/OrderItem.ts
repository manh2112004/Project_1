import { Entity } from "../common/Entity";

export interface OrderItemProps {
  id?: string;
  orderId?: string;
  storeId?: string | null;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice?: number;
  createdAt?: Date;
}

export class OrderItem extends Entity {
  private readonly _orderId: string;
  private readonly _storeId: string | null;
  private readonly _productId: string;
  private readonly _quantity: number;
  private readonly _unitPrice: number;
  private readonly _totalPrice: number;

  constructor(props: OrderItemProps) {
    super(props.id, props.createdAt);

    if (props.quantity <= 0) throw new Error("Số lượng phải lớn hơn 0.");
    if (props.unitPrice < 0) throw new Error("Đơn giá không được âm.");

    this._orderId = props.orderId ?? "";
    this._storeId = props.storeId ?? null;
    this._productId = props.productId;
    this._quantity = props.quantity;
    this._unitPrice = props.unitPrice;
    this._totalPrice = props.totalPrice ?? props.quantity * props.unitPrice;
  }

  public static create(props: {
    orderId?: string;
    storeId?: string | null;
    productId: string;
    quantity: number;
    unitPrice: number;
  }): OrderItem {
    return new OrderItem(props);
  }

  public get orderId(): string {
    return this._orderId;
  }
  public get storeId(): string | null {
    return this._storeId;
  }
  public get productId(): string {
    return this._productId;
  }
  public get quantity(): number {
    return this._quantity;
  }
  public get unitPrice(): number {
    return this._unitPrice;
  }
  public get totalPrice(): number {
    return this._totalPrice;
  }
}
