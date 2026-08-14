import { Request, Response } from "express";
import { CreateOrGetConversationUseCase } from "../../application/use-cases/chat/CreateOrGetConversationUseCase";
import { GetMyConversationsUseCase } from "../../application/use-cases/chat/GetMyConversationsUseCase";
import { SendMessageUseCase } from "../../application/use-cases/chat/SendMessageUseCase";
import { GetMessagesByConversationIdUseCase } from "../../application/use-cases/chat/GetMessagesByConversationIdUseCase";
import { RecallMessageUseCase } from "../../application/use-cases/chat/RecallMessageUseCase";
import { SenderType } from "../../domain/constant/MessageEnums";

export class ChatController {
  constructor(
    private readonly createOrGetConversationUseCase: CreateOrGetConversationUseCase,
    private readonly getMyConversationsUseCase: GetMyConversationsUseCase,
    private readonly sendMessageUseCase: SendMessageUseCase,
    private readonly getMessagesByConversationIdUseCase: GetMessagesByConversationIdUseCase,
    private readonly recallMessageUseCase: RecallMessageUseCase,
  ) { }
  async createOrGetConversation(req: Request, res: Response): Promise<void> {
    try {
      const currentUser = (req as any).user;
      const { storeId } = req.body;

      const conversation = await this.createOrGetConversationUseCase.execute({
        customerId: currentUser.id,
        storeId,
      });

      res.status(200).json({
        success: true,
        message: "Lấy thông tin phòng chat thành công.",
        data: conversation,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Lỗi tạo phòng chat.",
      });
    }
  }

  async getMyConversations(req: Request, res: Response): Promise<void> {
    try {
      const currentUser = (req as any).user;
      const storeId = req.query.storeId as string | undefined;

      const conversations = await this.getMyConversationsUseCase.execute({
        userId: currentUser.id,
        storeId,
      });

      res.status(200).json({
        success: true,
        message: "Lấy danh sách cuộc trò chuyện thành công.",
        data: conversations,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Lỗi lấy danh sách cuộc trò chuyện.",
      });
    }
  }

  async sendMessage(req: Request, res: Response): Promise<void> {
    try {
      const currentUser = (req as any).user;
      const {
        conversationId,
        content,
        senderType,
        type,
        attachments,
        metadata,
      } = req.body;

      const message = await this.sendMessageUseCase.execute({
        conversationId,
        senderId: currentUser.id,
        senderType: senderType || SenderType.CUSTOMER,
        type,
        content,
        attachments,
        metadata,
      });

      res.status(201).json({
        success: true,
        message: "Gửi tin nhắn thành công.",
        data: message,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Lỗi gửi tin nhắn.",
      });
    }
  }

  async getMessages(req: Request, res: Response): Promise<void> {
    try {
      const conversationId = Array.isArray(req.params.conversationId)
        ? req.params.conversationId[0]
        : req.params.conversationId;
      const limit = req.query.limit
        ? parseInt(req.query.limit as string, 10)
        : 30;
      const before = req.query.before as string | undefined;

      const messages = await this.getMessagesByConversationIdUseCase.execute({
        conversationId,
        limit,
        before,
      });

      res.status(200).json({
        success: true,
        message: "Lấy lịch sử tin nhắn thành công.",
        data: messages,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Lỗi lấy lịch sử tin nhắn.",
      });
    }
  }
  async recallMessage(req: Request, res: Response): Promise<void> {
    try {
      const currentUser = (req as any).user;
      const messageId = Array.isArray(req.params.messageId)
        ? req.params.messageId[0]
        : req.params.messageId;

      const recalledMessage = await this.recallMessageUseCase.execute({
        messageId,
        requestorId: currentUser.id,
      });

      res.status(200).json({
        success: true,
        message: "Thu hồi tin nhắn thành công.",
        data: recalledMessage,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Lỗi thu hồi tin nhắn.",
      });
    }
  }
}
