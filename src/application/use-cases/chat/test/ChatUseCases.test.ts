import { describe, it, expect, beforeEach } from 'vitest';
import { GetMyConversationsUseCase } from '../GetMyConversationsUseCase';
import { CreateOrGetConversationUseCase } from '../CreateOrGetConversationUseCase';
import { Conversation } from '../../../../domain/entities/Conversation';
import { IConversationRepository } from '../../../../domain/repositories/IConversationRepository';
import { IStoreRepository } from '../../../../domain/repositories/IStoreRepository';
import { IUserRepository } from '../../../../domain/repositories/IUserRepository';

class InMemoryConversationRepository implements IConversationRepository {
  private conversations: Map<string, Conversation> = new Map();

  async save(conversation: Conversation): Promise<Conversation> {
    this.conversations.set(conversation.id, conversation);
    return conversation;
  }

  async findById(id: string): Promise<Conversation | null> {
    return this.conversations.get(id) || null;
  }

  async findByCustomerId(customerId: string): Promise<Conversation[]> {
    return Array.from(this.conversations.values()).filter(
      (c) => c.customerId === customerId && c.lastMessageContent !== null
    );
  }

  async findByStoreId(storeId: string): Promise<Conversation[]> {
    return Array.from(this.conversations.values()).filter(
      (c) => c.storeId === storeId && c.lastMessageContent !== null
    );
  }

  async findByCustomerAndStore(customerId: string, storeId: string): Promise<Conversation | null> {
    return (
      Array.from(this.conversations.values()).find(
        (c) => c.customerId === customerId && c.storeId === storeId
      ) || null
    );
  }

  async delete(id: string): Promise<void> {
    this.conversations.delete(id);
  }
}

describe('Chat Use Cases - Empty Conversation Filtering', () => {
  let conversationRepo: InMemoryConversationRepository;
  let mockStoreRepo: any;
  let mockUserRepo: any;

  beforeEach(() => {
    conversationRepo = new InMemoryConversationRepository();
    mockStoreRepo = {
      findByUserId: async () => null,
      findById: async () => null,
    };
    mockUserRepo = {
      findById: async () => null,
    };
  });

  it('should create a conversation when customer clicks chat, but not list it in getMyConversations until message is sent', async () => {
    const createUseCase = new CreateOrGetConversationUseCase(conversationRepo);
    const getConversationsUseCase = new GetMyConversationsUseCase(
      conversationRepo,
      mockStoreRepo,
      mockUserRepo
    );

    // 1. Customer clicks Chat -> Create empty conversation
    const convDto = await createUseCase.execute({
      customerId: 'cust-1',
      storeId: 'store-1',
    });

    expect(convDto.id).toBeDefined();
    expect(convDto.lastMessageContent).toBeNull();

    // 2. Seller lists conversations -> Empty conversation should NOT be listed
    const sellerConversations = await getConversationsUseCase.execute({
      storeId: 'store-1',
      userId: 'seller-user-1',
    });
    expect(sellerConversations.length).toBe(0);

    // 3. Customer lists conversations -> Empty conversation should NOT be listed either
    const customerConversations = await getConversationsUseCase.execute({
      userId: 'cust-1',
    });
    expect(customerConversations.length).toBe(0);

    // 4. Send a message -> update lastMessageContent
    const conversation = await conversationRepo.findById(convDto.id);
    conversation!.updateLastMessage('Xin chào shop!');
    await conversationRepo.save(conversation!);

    // 5. Now seller lists conversations -> should include the conversation
    const sellerConversationsAfterMsg = await getConversationsUseCase.execute({
      storeId: 'store-1',
      userId: 'seller-user-1',
    });
    expect(sellerConversationsAfterMsg.length).toBe(1);
    expect(sellerConversationsAfterMsg[0].lastMessageContent).toBe('Xin chào shop!');
  });
});
