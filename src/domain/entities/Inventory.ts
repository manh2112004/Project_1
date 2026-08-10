import { randomUUID } from "crypto";

export interface InventoryProps {
  id?: string;
  productId: string;
  quantity: number;
  importPrice: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface UpdateInventoryProps {
  quantity?: number;
  importPrice?: number;
}

export class Inventory {
  public readonly id: string;
  public readonly productId: string;
  public quantity: number;
  public importPrice: number;
  public readonly createdAt: Date;
  public updatedAt: Date;
  public deletedAt: Date | null;

  constructor(props: InventoryProps) {
    this.id = props.id || randomUUID();
    this.productId = props.productId;
    this.quantity = props.quantity;
    this.importPrice = props.importPrice;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
    this.deletedAt = props.deletedAt || null;
  }

  public static create(props: {
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
      productId: props.productId,
      quantity: props.quantity,
      importPrice: props.importPrice,
    });
  }

  public update(props: UpdateInventoryProps): void {
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
