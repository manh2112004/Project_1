import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { UserOrmEntity } from "./UserOrmEntity";

@Entity({ name: "user_addresses" })
export class UserAddressOrmEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "user_id", type: "uuid" })
  userId!: string;

  @Column({ name: "recipient_name", type: "varchar", length: 100 })
  recipientName!: string;

  @Column({ name: "phone_number", type: "varchar", length: 20 })
  phoneNumber!: string;

  @Column({ name: "address_line_1", type: "varchar", length: 255 })
  addressLine1!: string;

  @Column({ name: "address_line_2", type: "varchar", length: 255, nullable: true })
  addressLine2!: string | null;

  @Column({ type: "varchar", length: 100 })
  ward!: string;

  @Column({ type: "varchar", length: 100 })
  district!: string;

  @Column({ type: "varchar", length: 100 })
  city!: string;

  @Column({ type: "varchar", length: 100, default: "Việt Nam", nullable: true })
  country!: string | null;

  @Column({ name: "postal_code", type: "varchar", length: 20, nullable: true })
  postalCode!: string | null;

  @Column({ name: "is_default", type: "boolean", default: false })
  isDefault!: boolean;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt!: Date;

  @ManyToOne(() => UserOrmEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: UserOrmEntity;
}
