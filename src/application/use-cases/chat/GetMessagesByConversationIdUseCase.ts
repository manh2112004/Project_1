import { IMessageRepository } from "../../../domain/repositories/IMessageRepository";
import { MessageResponseDto } from "../../dtos/chat/MessageDto";

export class GetMessagesByConversationIdUseCase {
  constructor(private readonly messageRepository: IMessageRepository) {}

  async execute(params: {
    conversationId: string;
    limit?: number;
    before?: string;
  }): Promise<MessageResponseDto[]> {
    const beforeDate = params.before ? new Date(params.before) : undefined;
    const messages = await this.messageRepository.findByConversationId(
      params.conversationId,
      params.limit || 30,
      beforeDate,
    );

    return messages.map((msg) => ({
      id: msg.id,
      conversationId: msg.conversationId,
      senderId: msg.senderId,
      senderType: msg.senderType,
      type: msg.type,
      content: msg.content,
      attachments: msg.attachments,
      metadata: msg.metadata,
      isRead: msg.isRead,
      readAt: msg.readAt ? msg.readAt.toISOString() : null,
      isRecalled: msg.isRecalled,
      createdAt: msg.createdAt.toISOString(),
      updatedAt: msg.updatedAt.toISOString(),
    }));
  }
}
