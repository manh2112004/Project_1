import { Repository, LessThan, Not } from "typeorm";
import { Message } from "../../../domain/entities/Message";
import { IMessageRepository } from "../../../domain/repositories/IMessageRepository";
import { MessageOrmEntity } from "../../database/entities/MessageOrmEntity";
import { MessageType, SenderType } from "../../../domain/constant/MessageEnums";

export class TypeOrmMessageRepository implements IMessageRepository {
  constructor(private readonly ormRepository: Repository<MessageOrmEntity>) { }

  async save(message: Message): Promise<Message> {
    const ormEntity = this.toOrm(message);
    const savedOrm = await this.ormRepository.save(ormEntity);
    return this.toDomain(savedOrm);
  }

  async findById(id: string): Promise<Message | null> {
    const found = await this.ormRepository.findOne({ where: { id } });
    return found ? this.toDomain(found) : null;
  }

  async findByConversationId(
    conversationId: string,
    limit: number = 30,
    before?: Date,
  ): Promise<Message[]> {
    const whereCondition: any = { conversationId };
    if (before) {
      whereCondition.createdAt = LessThan(before);
    }

    const found = await this.ormRepository.find({
      where: whereCondition,
      order: { createdAt: "DESC" },
      take: limit,
    });

    // Trả về danh sách xếp theo thứ tự thời gian tăng dần để UI render từ cũ tới mới
    return found.reverse().map((orm) => this.toDomain(orm));
  }

  async markAllAsRead(conversationId: string, readerId: string): Promise<void> {
    await this.ormRepository
      .createQueryBuilder()
      .update(MessageOrmEntity)
      .set({ isRead: true, readAt: new Date() })
      .where("conversationId = :conversationId", { conversationId })
      .andWhere("senderId != :readerId", { readerId })
      .andWhere("isRead = false")
      .execute();
  }

  async getUnreadCount(conversationId: string, userId: string): Promise<number> {
    return await this.ormRepository.count({
      where: {
        conversationId,
        isRead: false,
        senderId: Not(userId),
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.ormRepository.softDelete(id);
  }

  private toDomain(orm: MessageOrmEntity): Message {
    return new Message({
      id: orm.id,
      conversationId: orm.conversationId,
      senderId: orm.senderId,
      senderType: orm.senderType as SenderType,
      type: orm.type as MessageType,
      content: orm.content,
      attachments: orm.attachments || [],
      metadata: orm.metadata,
      isRead: orm.isRead,
      readAt: orm.readAt,
      isRecalled: orm.isRecalled,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
      deletedAt: orm.deletedAt,
    });
  }

  private toOrm(domain: Message): MessageOrmEntity {
    const orm = new MessageOrmEntity();
    if (domain.id) orm.id = domain.id;
    orm.conversationId = domain.conversationId;
    orm.senderId = domain.senderId;
    orm.senderType = domain.senderType;
    orm.type = domain.type;
    orm.content = domain.content;
    orm.attachments = domain.attachments;
    orm.metadata = domain.metadata;
    orm.isRead = domain.isRead;
    orm.readAt = domain.readAt;
    orm.isRecalled = domain.isRecalled;
    orm.createdAt = domain.createdAt;
    orm.updatedAt = domain.updatedAt;
    if (domain.deletedAt) orm.deletedAt = domain.deletedAt;
    return orm;
  }
}
