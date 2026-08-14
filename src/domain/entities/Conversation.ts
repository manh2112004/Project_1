import { AggregateRoot } from "../common/AggregateRoot";

export interface ConversationProps {
  id?: string;
  customerId: string;
  storeId: string;
  lastMessageContent?: string | null;
  lastMessageAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}
export class Conversation extends AggregateRoot {
  public readonly customerId: string;
  public readonly storeId: string;
  private _lastMessageContent: string | null;
  private _lastMessageAt: Date | null;

  public constructor(props: ConversationProps) {
    super(props.id, props.createdAt, props.updatedAt, props.deletedAt);
    this.customerId = props.customerId;
    this.storeId = props.storeId;
    this._lastMessageContent = props.lastMessageContent || null;
    this._lastMessageAt = props.lastMessageAt || null;
  }

  // Cấp quyền đọc qua getter
  public get lastMessageContent(): string | null {
    return this._lastMessageContent;
  }

  public get lastMessageAt(): Date | null {
    return this._lastMessageAt;
  }

  // Factory Method: TẠO PHÒNG CHAT MỚI
  public static create(props: {
    customerId: string;
    storeId: string;
  }): Conversation {
    if (!props.customerId || props.customerId.trim().length === 0) {
      throw new Error("Mã khách hàng không được để trống.");
    }
    if (!props.storeId || props.storeId.trim().length === 0) {
      throw new Error("Mã cửa hàng không được để trống.");
    }
    return new Conversation({
      customerId: props.customerId,
      storeId: props.storeId,
      lastMessageContent: null,
      lastMessageAt: null,
    });
  }

  // 4. NGHIỆP VỤ: CẬP NHẬT TIN NHẮN MỚI NHẤT
  // Khi một Message mới được gửi, Use Case sẽ lấy Conversation này ra và gọi hàm này
  public updateLastMessage(content: string, time: Date = new Date()): void {
    this._lastMessageContent = content;
    this._lastMessageAt = time;
    this.touch();
  }
}
