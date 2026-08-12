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
import type { StoreOrmEntity } from "./StoreOrmEntity";

@Entity({ name: "store_addresses" })
export class StoreAddressOrmEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "store_id", type: "uuid" })
  storeId!: string;

  @Column({ name: "contact_name", type: "varchar", length: 100 })
  contactName!: string;

  @Column({ name: "phone_number", type: "varchar", length: 20, nullable: true })
  phoneNumber!: string | null;

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

  @Column({ type: "double precision", nullable: true })
  latitude!: number | null;

  @Column({ type: "double precision", nullable: true })
  longitude!: number | null;

  @Column({ name: "is_default_pickup", type: "boolean", default: false })
  isDefaultPickup!: boolean;

  @Column({ name: "is_default_return", type: "boolean", default: false })
  isDefaultReturn!: boolean;

  @Column({ name: "is_default", type: "boolean", default: false })
  isDefault!: boolean;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt!: Date;

  @DeleteDateColumn({ name: "deleted_at", type: "timestamp", nullable: true })
  deletedAt!: Date | null;

  @ManyToOne("StoreOrmEntity", (store: any) => store.addresses, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "store_id" })
  store!: StoreOrmEntity;
}
