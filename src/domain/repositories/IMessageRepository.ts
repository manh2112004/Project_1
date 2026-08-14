import { Message } from "../entities/Message";

export interface IMessageRepository {
  save(message: Message): Promise<Message>;
  findById(id: string): Promise<Message | null>;
  findByConversationId(
    conversationId: string,
    limit?: number,
    before?: Date,
  ): Promise<Message[]>;
  markAllAsRead(conversationId: string, readerId: string): Promise<void>;
  delete(id: string): Promise<void>;
}
