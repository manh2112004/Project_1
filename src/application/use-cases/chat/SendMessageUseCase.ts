import { IConversationRepository } from "../../../domain/repositories/IConversationRepository";
import { IMessageRepository } from "../../../domain/repositories/IMessageRepository";
import { IStoreRepository } from "../../../domain/repositories/IStoreRepository";
import { Message } from "../../../domain/entities/Message";
import { SendMessageDto, MessageResponseDto } from "../../dtos/chat/MessageDto";
import { MessageSentEvent } from "../../../domain/events/MessageSentEvent";
import { EventEmitter2 } from "eventemitter2";

export class SendMessageUseCase {
  constructor(
    private readonly conversationRepository: IConversationRepository,
    private readonly messageRepository: IMessageRepository,
    private eventBus: EventEmitter2,
    private readonly storeRepository?: IStoreRepository,
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

    // 2. Tìm thông tin chủ cửa hàng (để bắn socket về channel cá nhân user:{storeOwnerId})
    let storeOwnerId: string | undefined;
    if (this.storeRepository) {
      try {
        const store = await this.storeRepository.findById(conversation.storeId);
        if (store) {
          storeOwnerId = store.userId;
        }
      } catch (e) {}
    }

    // 3. Tạo tin nhắn mới
    const message = Message.send({
      conversationId: dto.conversationId,
      senderId: dto.senderId,
      senderType: dto.senderType,
      type: dto.type,
      content: dto.content,
      attachments: dto.attachments,
      metadata: dto.metadata,
    });

    // 4. Lưu tin nhắn vào DB
    const savedMessage = await this.messageRepository.save(message);

    // 5. Cập nhật thông tin tin nhắn mới nhất vào phòng chat
    conversation.updateLastMessage(
      savedMessage.content,
      savedMessage.createdAt,
    );
    await this.conversationRepository.save(conversation);

    // 6. Rút bỏ các event cũ và phát sự kiện MessageSentEvent mới có chứa customerId & storeOwnerId
    message.pullDomainEvents();
    const sentEvent = new MessageSentEvent(
      savedMessage.conversationId,
      savedMessage.id,
      savedMessage.content,
      savedMessage.senderId,
      savedMessage.senderType,
      savedMessage.metadata,
      savedMessage.attachments,
      savedMessage.type,
      conversation.customerId,
      storeOwnerId,
    );

    this.eventBus.emit(sentEvent.constructor.name, sentEvent);

    // 7. Trả về Response DTO
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
