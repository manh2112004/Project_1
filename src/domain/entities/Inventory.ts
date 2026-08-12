import { randomUUID } from "crypto";

export interface InventoryProps {
  id?: string;
  storeId?: string | null;
  storeAddressId?: string | null;
  productId: string;
  quantity: number;
  importPrice: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface UpdateInventoryProps {
  storeId?: string | null;
  storeAddressId?: string | null;
  quantity?: number;
  importPrice?: number;
}

export class Inventory {
  public readonly id: string;
  public storeId: string | null;
  public storeAddressId: string | null;
  public readonly productId: string;
  public quantity: number;
  public importPrice: number;
  public readonly createdAt: Date;
  public updatedAt: Date;
  public deletedAt: Date | null;

  constructor(props: InventoryProps) {
    this.id = props.id || randomUUID();
    this.storeId = props.storeId ?? null;
    this.storeAddressId = props.storeAddressId ?? null;
    this.productId = props.productId;
    this.quantity = props.quantity;
    this.importPrice = props.importPrice;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
    this.deletedAt = props.deletedAt || null;
  }

  public static create(props: {
    storeId?: string | null;
    storeAddressId?: string | null;
    productId: string;
    quantity: number;
    importPrice: number;
  }): Inventory {
    if (!props.productId || props.productId.trim().length === 0) {
      throw new Error("Mã sản phẩm (productId) không được để trống.");
    }
    if (props.quantity < 0) {
      throw new Error("Số lượng tồn kho (quantity) không được nhỏ hơn 0.");
    }
    if (props.importPrice < 0) {
      throw new Error("Giá nhập hàng (importPrice) không được nhỏ hơn 0.");
    }

    return new Inventory({
      storeId: props.storeId,
      storeAddressId: props.storeAddressId,
      productId: props.productId,
      quantity: props.quantity,
      importPrice: props.importPrice,
    });
  }

  public update(props: UpdateInventoryProps): void {
    if (props.storeId !== undefined) {
      this.storeId = props.storeId;
    }
    if (props.storeAddressId !== undefined) {
      this.storeAddressId = props.storeAddressId;
    }
    if (props.quantity !== undefined) {
      if (props.quantity < 0) {
        throw new Error("Số lượng tồn kho (quantity) không được nhỏ hơn 0.");
      }
      this.quantity = props.quantity;
    }

    if (props.importPrice !== undefined) {
      if (props.importPrice < 0) {
        throw new Error("Giá nhập hàng (importPrice) không được nhỏ hơn 0.");
      }
      this.importPrice = props.importPrice;
    }

    this.updatedAt = new Date();
  }
  public deductQuantity(amount: number): void {
    if (amount <= 0) {
      throw new Error("Số lượng giảm phải lớn hơn 0.");
    }
    if (this.quantity < amount) {
      throw new Error(`Tồn kho không đủ để trừ (Còn lại: ${this.quantity}, cần trừ: ${amount}).`);
    }
    this.quantity -= amount;
    this.updatedAt = new Date();
  }

  public delete(): void {
    this.deletedAt = new Date();
  }
}
