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
import { ProductOrmEntity } from "./ProductOrmEntity";

const numericTransformer = {
  to: (value: number | null) => value,
  from: (value: string | null) => (value !== null ? parseFloat(value) : null),
};

@Entity({ name: "inventories" })
export class InventoryOrmEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "product_id", type: "varchar", unique: true })
  productId!: string;

  @Column({ type: "integer", default: 0 })
  quantity!: number;

  @Column({
    name: "import_price",
    type: "decimal",
    precision: 15,
    scale: 2,
    transformer: numericTransformer,
  })
  importPrice!: number;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt!: Date;

  @DeleteDateColumn({ name: "deleted_at", type: "timestamp", nullable: true })
  deletedAt!: Date | null;
  // Relationship
  @ManyToOne(() => ProductOrmEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "product_id" })
  product!: ProductOrmEntity;
}
