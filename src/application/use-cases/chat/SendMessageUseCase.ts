import { IConversationRepository } from "../../../domain/repositories/IConversationRepository";
import { IMessageRepository } from "../../../domain/repositories/IMessageRepository";
import { Message } from "../../../domain/entities/Message";
import { SendMessageDto, MessageResponseDto } from "../../dtos/chat/MessageDto";
import { EventEmitter2 } from "eventemitter2";
export class SendMessageUseCase {
  constructor(
    private readonly conversationRepository: IConversationRepository,
    private readonly messageRepository: IMessageRepository,
    private eventBus: EventEmitter2,
  ) {}

  async execute(dto: SendMessageDto): Promise<MessageResponseDto> {
    // 1. Kiểm tra phòng chat tồn tại
    const conversation = await this.conversationRepository.findById(
      dto.conversationId,
    );
    if (!conversation) {
      throw new Error(
        `Cuộc trò chuyện với ID '${dto.conversationId}' không tồn tại.`,
      );
    }

    // 2. Tạo tin nhắn mới (phát bắn MessageSentEvent)
    const message = Message.send({
      conversationId: dto.conversationId,
      senderId: dto.senderId,
      senderType: dto.senderType,
      type: dto.type,
      content: dto.content,
      attachments: dto.attachments,
      metadata: dto.metadata,
    });

    // 3. Lưu tin nhắn vào DB
    const savedMessage = await this.messageRepository.save(message);

    // 4. Cập nhật thông tin tin nhắn mới nhất vào phòng chat
    conversation.updateLastMessage(
      savedMessage.content,
      savedMessage.createdAt,
    );
    await this.conversationRepository.save(conversation);
    //RÚT SỰ KIỆN RA VÀ PHÁT THANH!
    const domainEvents = message.pullDomainEvents();
    for (const event of domainEvents) {
      //Ném bức thư lên không trung, ai muốn nghe thì nghe
      this.eventBus.emit(event.constructor.name, event);
    }
    // 5. Trả về Response DTO
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
