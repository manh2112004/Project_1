import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { OrderItemOrmEntity } from "./OrderItemOrmEntity";
import { UserOrmEntity } from "./UserOrmEntity";

@Entity({ name: "orders" })
export class OrderOrmEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "user_id", type: "uuid" })
  userId!: string;

  @Column({ name: "order_code", type: "varchar", length: 50, unique: true })
  orderCode!: string;

  @Column({ type: "varchar", length: 30, default: "PENDING" })
  status!: string;

  @Column({
    name: "total_amount",
    type: "decimal",
    precision: 15,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  totalAmount!: number;

  @Column({
    name: "discount_amount",
    type: "decimal",
    precision: 15,
    scale: 2,
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  discountAmount!: number;

  @Column({
    name: "shipping_fee",
    type: "decimal",
    precision: 15,
    scale: 2,
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  shippingFee!: number;

  @Column({
    name: "final_amount",
    type: "decimal",
    precision: 15,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  finalAmount!: number;

  @Column({ name: "payment_method", type: "varchar", length: 30 })
  paymentMethod!: string;

  @Column({ name: "payment_status", type: "varchar", length: 30, default: "UNPAID" })
  paymentStatus!: string;

  @Column({ name: "recipient_name", type: "varchar", length: 100 })
  recipientName!: string;

  @Column({ name: "phone_number", type: "varchar", length: 20 })
  phoneNumber!: string;

  @Column({ name: "shipping_address", type: "text" })
  shippingAddress!: string;

  @Column({ name: "shipping_code", type: "varchar", length: 100, nullable: true })
  shippingCode!: string | null;

  @Column({ name: "customer_note", type: "text", nullable: true })
  customerNote!: string | null;

  @Column({ name: "cancel_reason", type: "text", nullable: true })
  cancelReason!: string | null;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt!: Date;

  @DeleteDateColumn({ name: "deleted_at", type: "timestamp", nullable: true })
  deletedAt!: Date | null;

  @OneToMany(() => OrderItemOrmEntity, (item) => item.order, { cascade: true })
  items!: OrderItemOrmEntity[];

  @ManyToOne(() => UserOrmEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: UserOrmEntity;
}
