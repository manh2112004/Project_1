import { IMessageRepository } from "../../../domain/repositories/IMessageRepository";
import { MessageResponseDto } from "../../dtos/chat/MessageDto";

export class RecallMessageUseCase {
  constructor(private readonly messageRepository: IMessageRepository) {}

  async execute(params: {
    messageId: string;
    requestorId: string;
  }): Promise<MessageResponseDto> {
    const message = await this.messageRepository.findById(params.messageId);
    if (!message) {
      throw new Error(`Tin nhắn với ID '${params.messageId}' không tồn tại.`);
    }

    // Gọi hàm nghiệp vụ thu hồi tin nhắn
    message.recall(params.requestorId);

    const savedMessage = await this.messageRepository.save(message);

    return {
      id: savedMessage.id,
      conversationId: savedMessage.conversationId,
      senderId: savedMessage.senderId,
      senderType: savedMessage.senderType,
      type: savedMessage.type,
      content: savedMessage.content,
      attachments: savedMessage.attachments,
      metadata: savedMessage.metadata,
      isRead: savedMessage.isRead,
      readAt: savedMessage.readAt ? savedMessage.readAt.toISOString() : null,
      isRecalled: savedMessage.isRecalled,
      createdAt: savedMessage.createdAt.toISOString(),
      updatedAt: savedMessage.updatedAt.toISOString(),
    };
  }
}
