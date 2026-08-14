import { Router } from "express";
import { AppDataSource } from "../../infrastructure/database/data-source";
import { ConversationOrmEntity } from "../../infrastructure/database/entities/ConversationOrmEntity";
import { MessageOrmEntity } from "../../infrastructure/database/entities/MessageOrmEntity";
import { StoreOrmEntity } from "../../infrastructure/database/entities/StoreOrmEntity";
import { UserOrmEntity } from "../../infrastructure/database/entities/UserOrmEntity";
import { TypeOrmConversationRepository } from "../../infrastructure/repositories/conversation/TypeOrmConversationRepository";
import { TypeOrmMessageRepository } from "../../infrastructure/repositories/message/TypeOrmMessageRepository";
import { TypeOrmStoreRepository } from "../../infrastructure/repositories/store/TypeOrmStoreRepository";
import { TypeOrmUserRepository } from "../../infrastructure/repositories/user/TypeOrmUserRepository";

// Import các Use Cases
import { CreateOrGetConversationUseCase } from "../../application/use-cases/chat/CreateOrGetConversationUseCase";
import { GetMyConversationsUseCase } from "../../application/use-cases/chat/GetMyConversationsUseCase";
import { SendMessageUseCase } from "../../application/use-cases/chat/SendMessageUseCase";
import { GetMessagesByConversationIdUseCase } from "../../application/use-cases/chat/GetMessagesByConversationIdUseCase";
import { RecallMessageUseCase } from "../../application/use-cases/chat/RecallMessageUseCase";
import { ChatController } from "../controllers/ChatController";
import { authenticate } from "../middlewares/authenticate";

export const createChatRouter = (): Router => {
  const chatRouter = Router();

  const conversationOrmRepo = AppDataSource.getRepository(ConversationOrmEntity);
  const messageOrmRepo = AppDataSource.getRepository(MessageOrmEntity);
  const storeOrmRepo = AppDataSource.getRepository(StoreOrmEntity);
  const userOrmRepo = AppDataSource.getRepository(UserOrmEntity);

  const conversationRepository = new TypeOrmConversationRepository(conversationOrmRepo);
  const messageRepository = new TypeOrmMessageRepository(messageOrmRepo);
  const storeRepository = new TypeOrmStoreRepository(storeOrmRepo);
  const userRepository = new TypeOrmUserRepository(userOrmRepo);

  const createOrGetConversationUseCase = new CreateOrGetConversationUseCase(
    conversationRepository,
  );
  const getMyConversationsUseCase = new GetMyConversationsUseCase(
    conversationRepository,
    storeRepository,
    userRepository,
  );
  const sendMessageUseCase = new SendMessageUseCase(
    conversationRepository,
    messageRepository,
  );
  const getMessagesByConversationIdUseCase = new GetMessagesByConversationIdUseCase(
    messageRepository,
  );
  const recallMessageUseCase = new RecallMessageUseCase(messageRepository);

  const chatController = new ChatController(
    createOrGetConversationUseCase,
    getMyConversationsUseCase,
    sendMessageUseCase,
    getMessagesByConversationIdUseCase,
    recallMessageUseCase,
  );

  chatRouter.use(authenticate);

  // Route phòng chat (Conversation)
  chatRouter.post("/conversations", (req, res) =>
    chatController.createOrGetConversation(req, res),
  );
  chatRouter.get("/conversations", (req, res) =>
    chatController.getMyConversations(req, res),
  );

  // Route tin nhắn (Messages)
  chatRouter.post("/messages", (req, res) => chatController.sendMessage(req, res));
  chatRouter.get("/conversations/:conversationId/messages", (req, res) =>
    chatController.getMessages(req, res),
  );
  chatRouter.patch("/messages/:messageId/recall", (req, res) =>
    chatController.recallMessage(req, res),
  );

  return chatRouter;
};
