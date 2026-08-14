export interface CreateConversationDto {
  customerId: string;
  storeId: string;
}

export interface ConversationResponseDto {
  id: string;
  customerId: string;
  storeId: string;
  lastMessageContent: string | null;
  lastMessageAt: string | null;
  createdAt: string;
  updatedAt: string;
  store?: {
    id: string;
    name: string;
    logo?: string | null;
  } | null;
  customer?: {
    id: string;
    fullName: string;
    avatarUrl?: string | null;
  } | null;
}
