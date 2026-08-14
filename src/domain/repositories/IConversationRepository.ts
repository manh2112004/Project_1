import { Conversation } from "../entities/Conversation";

export interface IConversationRepository {
  save(conversation: Conversation): Promise<Conversation>;
  findById(id: string): Promise<Conversation | null>;
  findByCustomerId(customerId: string): Promise<Conversation[]>;
  findByStoreId(storeId: string): Promise<Conversation[]>;
  findByCustomerAndStore(customerId: string, storeId: string): Promise<Conversation | null>;
  delete(id: string): Promise<void>;
}
