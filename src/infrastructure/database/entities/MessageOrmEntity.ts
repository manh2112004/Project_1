import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { ConversationOrmEntity } from "./ConversationOrmEntity";

@Entity({ name: "messages" })
export class MessageOrmEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "conversation_id", type: "uuid" })
  conversationId!: string;

  @Column({ name: "sender_id", type: "uuid" })
  senderId!: string;

  @Column({ name: "sender_type", type: "varchar", length: 30 })
  senderType!: string;

  @Column({ type: "varchar", length: 30, default: "TEXT" })
  type!: string;

  @Column({ type: "text" })
  content!: string;

  @Column({ type: "jsonb", nullable: true, default: "[]" })
  attachments!: any[] | null;

  @Column({ type: "jsonb", nullable: true })
  metadata!: Record<string, any> | null;

  @Column({ name: "is_read", type: "boolean", default: false })
  isRead!: boolean;

  @Column({ name: "read_at", type: "timestamp", nullable: true })
  readAt!: Date | null;

  @Column({ name: "is_recalled", type: "boolean", default: false })
  isRecalled!: boolean;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt!: Date;

  @DeleteDateColumn({ name: "deleted_at", type: "timestamp", nullable: true })
  deletedAt!: Date | null;

  @ManyToOne(() => ConversationOrmEntity, (conv) => conv.messages, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "conversation_id" })
  conversation?: ConversationOrmEntity;
}
