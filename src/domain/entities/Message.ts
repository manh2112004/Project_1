import { AggregateRoot } from "../common/AggregateRoot";
import { MessageSentEvent } from "../events/MessageSentEvent";
import { MessageType, SenderType } from "../constant/MessageEnums";

export interface MessageAttachment {
  type: "IMAGE" | "FILE";
  url: string;
  name?: string;
  size?: number;
}

export interface MessageProps {
  id?: string;
  conversationId: string;
  senderId: string;
  senderType: SenderType;
  type?: MessageType;
  content: string;
  attachments?: MessageAttachment[];
  metadata?: Record<string, any> | null;
  isRead?: boolean;
  readAt?: Date | null;
  isRecalled?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export class Message extends AggregateRoot {
  public readonly conversationId: string;
  public readonly senderId: string;
  public readonly senderType: SenderType;
  public readonly type: MessageType;

  private _content: string;
  private _attachments: MessageAttachment[];
  private _metadata: Record<string, any> | null;
  private _isRead: boolean;
  private _readAt: Date | null;
  private _isRecalled: boolean;

  constructor(props: MessageProps) {
    super(props.id, props.createdAt, props.updatedAt, props.deletedAt);

    if (!props.conversationId || props.conversationId.trim().length === 0) {
      throw new Error("Mã cuộc trò chuyện không được để trống.");
    }
    if (!props.senderId || props.senderId.trim().length === 0) {
      throw new Error("Mã người gửi (senderId) không được để trống.");
    }

    this.conversationId = props.conversationId;
    this.senderId = props.senderId;
    this.senderType = props.senderType;
    this.type = props.type ?? MessageType.TEXT;
    this._content = props.content;
    this._attachments = props.attachments || [];
    this._metadata = props.metadata || null;
    this._isRead = props.isRead || false;
    this._readAt = props.readAt || null;
    this._isRecalled = props.isRecalled || false;
  }
  public get content(): string {
    return this._isRecalled ? "Tin nhắn đã được thu hồi" : this._content;
  }

  public get attachments(): MessageAttachment[] {
    return this._isRecalled ? [] : [...this._attachments];
  }

  public get metadata(): Record<string, any> | null {
    return this._metadata;
  }

  public get isRead(): boolean {
    return this._isRead;
  }

  public get readAt(): Date | null {
    return this._readAt;
  }

  public get isRecalled(): boolean {
    return this._isRecalled;
  }

  public static send(props: {
    conversationId: string;
    senderId: string;
    senderType: SenderType;
    type?: MessageType;
    content: string;
    attachments?: MessageAttachment[];
    metadata?: Record<string, any>;
  }): Message {
    const msgType = props.type ?? MessageType.TEXT;
    if (
      msgType === MessageType.TEXT &&
      (!props.content || props.content.trim().length === 0)
    ) {
      throw new Error("Nội dung tin nhắn văn bản không được để trống.");
    }

    const message = new Message({
      conversationId: props.conversationId,
      senderId: props.senderId,
      senderType: props.senderType,
      type: msgType,
      content: props.content,
      attachments: props.attachments,
      metadata: props.metadata,
    });

    // Phát bắn sự kiện Domain (Domain Event)
    message.addDomainEvent(
      new MessageSentEvent(
        message.conversationId,
        message.id,
        message.content,
        message.senderId,
        message.senderType,
      ),
    );

    return message;
  }
  public markAsRead(readAt: Date = new Date()): void {
    if (!this._isRead) {
      this._isRead = true;
      this._readAt = readAt;
      this.touch();
    }
  }

  public recall(requestorId: string): void {
    if (this.senderId !== requestorId) {
      throw new Error("Bạn chỉ có thể thu hồi tin nhắn do chính mình gửi.");
    }
    if (this._isRecalled) {
      return;
    }
    this._isRecalled = true;
    this.touch();
  }
}
