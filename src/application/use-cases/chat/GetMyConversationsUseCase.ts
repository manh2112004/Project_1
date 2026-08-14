import { IConversationRepository } from "../../../domain/repositories/IConversationRepository";
import { IStoreRepository } from "../../../domain/repositories/IStoreRepository";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { Conversation } from "../../../domain/entities/Conversation";
import { ConversationResponseDto } from "../../dtos/chat/ConversationDto";

export class GetMyConversationsUseCase {
  constructor(
    private readonly conversationRepository: IConversationRepository,
    private readonly storeRepository: IStoreRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(params: { userId?: string; storeId?: string }): Promise<ConversationResponseDto[]> {
    const userId = params.userId;
    if (!userId) {
      throw new Error("Phải cung cấp userId để lấy danh sách cuộc trò chuyện.");
    }

    // 1. Tìm danh sách cuộc trò chuyện khi User đóng vai trò Khách hàng (customer_id = userId)
    const customerConversations = await this.conversationRepository.findByCustomerId(userId);

    // 2. Kiểm tra xem User này có làm chủ Cửa hàng nào không
    let storeConversations: Conversation[] = [];
    if (params.storeId) {
      storeConversations = await this.conversationRepository.findByStoreId(params.storeId);
    } else {
      const myStore = await this.storeRepository.findByUserId(userId);
      if (myStore) {
        storeConversations = await this.conversationRepository.findByStoreId(myStore.id);
      }
    }

    // 3. Hợp nhất danh sách, loại bỏ trùng lặp và loại bỏ các cuộc trò chuyện chưa có tin nhắn
    const conversationMap = new Map<string, Conversation>();
    [...customerConversations, ...storeConversations].forEach((conv) => {
      if (conv.lastMessageContent !== null && conv.lastMessageContent !== undefined) {
        conversationMap.set(conv.id, conv);
      }
    });

    const allConversations = Array.from(conversationMap.values()).sort((a, b) => {
      const timeA = a.lastMessageAt ? a.lastMessageAt.getTime() : a.createdAt.getTime();
      const timeB = b.lastMessageAt ? b.lastMessageAt.getTime() : b.createdAt.getTime();
      return timeB - timeA;
    });

    // 4. Map DTO và bổ sung tên/ảnh của Store và Customer
    const result: ConversationResponseDto[] = await Promise.all(
      allConversations.map(async (conv) => {
        let storeInfo: { id: string; name: string; logo?: string | null } | null = null;
        let customerInfo: { id: string; fullName: string; avatarUrl?: string | null } | null = null;

        try {
          const storeEntity = await this.storeRepository.findById(conv.storeId);
          if (storeEntity) {
            storeInfo = {
              id: storeEntity.id,
              name: storeEntity.name,
              logo: storeEntity.logo || null,
            };
          }
        } catch (e) {}

        try {
          const userEntity = await this.userRepository.findById(conv.customerId);
          if (userEntity) {
            customerInfo = {
              id: userEntity.id,
              fullName: userEntity.fullName,
              avatarUrl: userEntity.avatarUrl || null,
            };
          }
        } catch (e) {}

        return {
          id: conv.id,
          customerId: conv.customerId,
          storeId: conv.storeId,
          lastMessageContent: conv.lastMessageContent,
          lastMessageAt: conv.lastMessageAt ? conv.lastMessageAt.toISOString() : null,
          createdAt: conv.createdAt.toISOString(),
          updatedAt: conv.updatedAt.toISOString(),
          store: storeInfo,
          customer: customerInfo,
        };
      }),
    );

    return result;
  }
}
