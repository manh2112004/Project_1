import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { UserOrmEntity } from "./UserOrmEntity";
import { StoreAddressOrmEntity } from "./StoreAddressOrmEntity";

@Entity({ name: "stores" })
export class StoreOrmEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "user_id", type: "uuid" })
  userId!: string;

  @Column({ type: "varchar", length: 150 })
  name!: string;

  @Column({ type: "text", nullable: true })
  description!: string | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  logo!: string | null;

  @Column({ name: "cover_image", type: "varchar", length: 255, nullable: true })
  coverImage!: string | null;

  @Column({ name: "contact_phone", type: "varchar", length: 20, nullable: true })
  contactPhone!: string | null;

  @Column({ name: "contact_email", type: "varchar", length: 150 })
  contactEmail!: string;

  @Column({ name: "business_type", type: "varchar", length: 50 })
  businessType!: string;

  @Column({ name: "tax_code", type: "varchar", length: 50, nullable: true })
  taxCode!: string | null;

  @Column({ name: "identity_number", type: "varchar", length: 50, nullable: true })
  identityNumber!: string | null;

  @Column({ type: "varchar", length: 50, default: "PENDING" })
  status!: string;

  @Column({ name: "status_note", type: "text", nullable: true })
  statusNote!: string | null;

  @Column({ name: "is_on_vacation", type: "boolean", default: false })
  isOnVacation!: boolean;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt!: Date;

  @DeleteDateColumn({ name: "deleted_at", type: "timestamp", nullable: true })
  deletedAt!: Date | null;

  @ManyToOne(() => UserOrmEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "user_id" })
  user!: UserOrmEntity;

  @OneToMany(() => StoreAddressOrmEntity, (address) => address.store, {
    cascade: true,
  })
  addresses!: StoreAddressOrmEntity[];
}
