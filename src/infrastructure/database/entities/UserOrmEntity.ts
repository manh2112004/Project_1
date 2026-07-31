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
import { RoleOrmEntity } from "./RoleOrmEntity";

@Entity({ name: "users" })
export class UserOrmEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "role_id", type: "uuid" })
  roleId!: string;

  @Column({ type: "varchar", length: 150, unique: true })
  email!: string;

  @Column({ name: "phone_number", type: "varchar", length: 15, unique: true, nullable: true })
  phoneNumber!: string | null;

  @Column({ name: "password_hash", type: "varchar", length: 255 })
  passwordHash!: string;

  @Column({ name: "full_name", type: "varchar", length: 100 })
  fullName!: string;

  @Column({ name: "avatar_url", type: "varchar", length: 255, nullable: true })
  avatarUrl!: string | null;

  @Column({ name: "date_of_birth", type: "timestamp", nullable: true })
  dateOfBirth!: Date | null;

  @Column({ type: "varchar", length: 20 })
  gender!: string;

  @Column({ type: "varchar", length: 20, default: "ACTIVE" })
  status!: string;

  @Column({ name: "email_verified_at", type: "timestamp", nullable: true })
  emailVerifiedAt!: Date | null;

  @Column({ name: "phone_verified_at", type: "timestamp", nullable: true })
  phoneVerifiedAt!: Date | null;

  @Column({ name: "last_login_at", type: "timestamp", nullable: true })
  lastLoginAt!: Date | null;

  @Column({ name: "refresh_token", type: "text", nullable: true }) // Dùng text để tránh tràn token
  refreshToken!: string | null;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt!: Date;

  @DeleteDateColumn({ name: "deleted_at", type: "timestamp", nullable: true })
  deletedAt!: Date | null;

  // Thiết lập quan hệ ManyToOne với bảng roles
  @ManyToOne(() => RoleOrmEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "role_id" })
  role!: RoleOrmEntity;
}
