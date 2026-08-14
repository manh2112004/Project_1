import { IConversationRepository } from "../../../domain/repositories/IConversationRepository";
import { Conversation } from "../../../domain/entities/Conversation";
import {
  CreateConversationDto,
  ConversationResponseDto,
} from "../../dtos/chat/ConversationDto";

export class CreateOrGetConversationUseCase {
  constructor(
    private readonly conversationRepository: IConversationRepository,
  ) {}

  async execute(dto: CreateConversationDto): Promise<ConversationResponseDto> {
    // 1. Kiểm tra xem phòng chat giữa Khách - Shop đã tồn tại chưa
    let conversation = await this.conversationRepository.findByCustomerAndStore(
      dto.customerId,
      dto.storeId,
    );

    // 2. Nếu chưa có -> Tạo mới phòng chat
    if (!conversation) {
      conversation = Conversation.create({
        customerId: dto.customerId,
        storeId: dto.storeId,
      });
      conversation = await this.conversationRepository.save(conversation);
    }

    // 3. Trả về DTO
    return {
      id: conversation.id,
      customerId: conversation.customerId,
      storeId: conversation.storeId,
      lastMessageContent: conversation.lastMessageContent,
      lastMessageAt: conversation.lastMessageAt
        ? conversation.lastMessageAt.toISOString()
        : null,
      createdAt: conversation.createdAt.toISOString(),
      updatedAt: conversation.updatedAt.toISOString(),
    };
  }
}
