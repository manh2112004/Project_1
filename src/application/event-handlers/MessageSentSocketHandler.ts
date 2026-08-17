import { MessageSentEvent } from "../../domain/events/MessageSentEvent";
import { IRealtimeNotifier } from "../ports/IRealtimeNotifier";

export class MessageSentSocketHandler {
  constructor(private readonly realtimeNotifier: IRealtimeNotifier) {}

  public handle(event: MessageSentEvent): void {
    // Phát tin nhắn tới tất cả client nằm trong phòng conversationId
    this.realtimeNotifier.emitToRoom(
      `conversation:${event.conversationId}`,
      "chat:new_message",
      {
        id: event.messageId,
        conversationId: event.conversationId,
        senderId: event.senderId,
        senderType: event.senderType,
        type: event.type,
        content: event.content,
        attachments: event.attachments,
        metadata: event.metadata,
        createdAt: event.occurredOn.toISOString(),
      },
    );
  }
}
