import { Repository, Not, IsNull } from "typeorm";
import { Conversation } from "../../../domain/entities/Conversation";
import { IConversationRepository } from "../../../domain/repositories/IConversationRepository";
import { ConversationOrmEntity } from "../../database/entities/ConversationOrmEntity";

export class TypeOrmConversationRepository implements IConversationRepository {
  constructor(private readonly ormRepository: Repository<ConversationOrmEntity>) {}

  async save(conversation: Conversation): Promise<Conversation> {
    const ormEntity = this.toOrm(conversation);
    const savedOrm = await this.ormRepository.save(ormEntity);
    return this.toDomain(savedOrm);
  }

  async findById(id: string): Promise<Conversation | null> {
    const found = await this.ormRepository.findOne({ where: { id } });
    return found ? this.toDomain(found) : null;
  }

  async findByCustomerId(customerId: string): Promise<Conversation[]> {
    const found = await this.ormRepository.find({
      where: { customerId, lastMessageContent: Not(IsNull()) },
      order: { lastMessageAt: "DESC", createdAt: "DESC" },
    });
    return found.map((orm) => this.toDomain(orm));
  }

  async findByStoreId(storeId: string): Promise<Conversation[]> {
    const found = await this.ormRepository.find({
      where: { storeId, lastMessageContent: Not(IsNull()) },
      order: { lastMessageAt: "DESC", createdAt: "DESC" },
    });
    return found.map((orm) => this.toDomain(orm));
  }

  async findByCustomerAndStore(
    customerId: string,
    storeId: string,
  ): Promise<Conversation | null> {
    const found = await this.ormRepository.findOne({
      where: { customerId, storeId },
    });
    return found ? this.toDomain(found) : null;
  }

  async delete(id: string): Promise<void> {
    await this.ormRepository.softDelete(id);
  }

  private toDomain(orm: ConversationOrmEntity): Conversation {
    return new Conversation({
      id: orm.id,
      customerId: orm.customerId,
      storeId: orm.storeId,
      lastMessageContent: orm.lastMessageContent,
      lastMessageAt: orm.lastMessageAt,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
      deletedAt: orm.deletedAt,
    });
  }

  private toOrm(domain: Conversation): ConversationOrmEntity {
    const orm = new ConversationOrmEntity();
    if (domain.id) orm.id = domain.id;
    orm.customerId = domain.customerId;
    orm.storeId = domain.storeId;
    orm.lastMessageContent = domain.lastMessageContent;
    orm.lastMessageAt = domain.lastMessageAt;
    orm.createdAt = domain.createdAt;
    orm.updatedAt = domain.updatedAt;
    if (domain.deletedAt) orm.deletedAt = domain.deletedAt;
    return orm;
  }
}
