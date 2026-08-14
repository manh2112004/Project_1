import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from "typeorm";
import { MessageOrmEntity } from "./MessageOrmEntity";

@Entity({ name: "conversations" })
export class ConversationOrmEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "customer_id", type: "uuid" })
  customerId!: string;

  @Column({ name: "store_id", type: "uuid" })
  storeId!: string;

  @Column({ name: "last_message_content", type: "text", nullable: true })
  lastMessageContent!: string | null;

  @Column({ name: "last_message_at", type: "timestamp", nullable: true })
  lastMessageAt!: Date | null;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt!: Date;

  @DeleteDateColumn({ name: "deleted_at", type: "timestamp", nullable: true })
  deletedAt!: Date | null;

  @OneToMany(() => MessageOrmEntity, (message) => message.conversation)
  messages?: MessageOrmEntity[];
}
