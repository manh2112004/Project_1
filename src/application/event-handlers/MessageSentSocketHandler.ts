import { MessageSentEvent } from "../../domain/events/MessageSentEvent";
import { IRealtimeNotifier } from "../ports/IRealtimeNotifier";

export class MessageSentSocketHandler {
  constructor(private readonly realtimeNotifier: IRealtimeNotifier) {}

  public handle(event: MessageSentEvent): void {
    const payload = {
      id: event.messageId,
      conversationId: event.conversationId,
      senderId: event.senderId,
      senderType: event.senderType,
      type: event.type,
      content: event.content,
      attachments: event.attachments,
      metadata: event.metadata,
      createdAt: event.occurredOn.toISOString(),
    };

    // 1. Phát tin nhắn tới tất cả client nằm trong phòng conversationId
    this.realtimeNotifier.emitToRoom(
      `conversation:${event.conversationId}`,
      "chat:new_message",
      payload,
    );

    // 2. Bắn trực tiếp về channel cá nhân user:{userId} của Khách hàng & Chủ cửa hàng
    // Nhờ vậy người dùng dù đang ở danh sách cuộc trò chuyện cũng lập tức nhận tin nhắn preview Realtime
    if (event.customerId) {
      this.realtimeNotifier.emitToRoom(
        `user:${event.customerId}`,
        "chat:new_message",
        payload,
      );
    }

    if (event.storeOwnerId) {
      this.realtimeNotifier.emitToRoom(
        `user:${event.storeOwnerId}`,
        "chat:new_message",
        payload,
      );
    }
  }
}
