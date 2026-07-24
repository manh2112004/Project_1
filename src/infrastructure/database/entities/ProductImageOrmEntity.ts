import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn
} from "typeorm";
import { ProductOrmEntity } from "./ProductOrmEntity";

@Entity({ name: "product_images" })
export class ProductImageOrmEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ name: "product_id", type: "varchar" })
    productId!: string;

    @Column({ name: "image_url", type: "varchar", length: 500 })
    imageUrl!: string;

    @Column({ name: "is_thumbnail", type: "boolean", default: false })
    isThumbnail!: boolean;

    @Column({ name: "sort_order", type: "integer", default: 0 })
    sortOrder!: number;

    @CreateDateColumn({ name: "created_at", type: "timestamp" })
    createdAt!: Date;

    @ManyToOne(() => ProductOrmEntity, { onDelete: "CASCADE" })
    @JoinColumn({ name: "product_id" })
    product!: ProductOrmEntity;
}
