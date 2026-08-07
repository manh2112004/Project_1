import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from "typeorm";
import { UserOrmEntity } from "./UserOrmEntity";

@Entity({ name: "user_social_accounts" })
@Unique(["provider", "subId"])
export class UserSocialAccountOrmEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "user_id", type: "uuid" })
  userId!: string;

  @Column({ type: "varchar", length: 20 })
  provider!: string;

  @Column({ name: "sub_id", type: "varchar", length: 100 })
  subId!: string;

  @Column({ type: "varchar", length: 150, nullable: true })
  email!: string | null;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt!: Date;

  @ManyToOne(() => UserOrmEntity, (user) => user.socialAccounts, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user!: UserOrmEntity;
}
