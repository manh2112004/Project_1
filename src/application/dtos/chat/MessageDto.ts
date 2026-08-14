import { MessageType, SenderType } from "../../../domain/constant/MessageEnums";
import { MessageAttachment } from "../../../domain/entities/Message";

export interface SendMessageDto {
  conversationId: string;
  senderId: string;
  senderType: SenderType;
  type?: MessageType;
  content: string;
  attachments?: MessageAttachment[];
  metadata?: Record<string, any>;
}

export interface MessageResponseDto {
  id: string;
  conversationId: string;
  senderId: string;
  senderType: SenderType;
  type: MessageType;
  content: string;
  attachments: MessageAttachment[];
  metadata: Record<string, any> | null;
  isRead: boolean;
  readAt: string | null;
  isRecalled: boolean;
  createdAt: string;
  updatedAt: string;
}
