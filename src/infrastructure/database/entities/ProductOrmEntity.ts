import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    JoinColumn
} from "typeorm";
import { CategoryOrmEntity } from "./CategoryOrmEntity";
import { BrandOrmEntity } from "./BrandOrmEntity";
const numericTransformer = {
    //Dùng khi GHI dữ liệu (Object -> Database
    to: (value: number | null) => value,
    //Dùng khi ĐỌC dữ liệu (Database -> Object)
    from: (value: string | null) => (value !== null ? parseFloat(value) : null),
};

@Entity({ name: "products" })
export class ProductOrmEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ name: "category_id", type: "varchar" })
    categoryId!: string;

    @Column({ name: "brand_id", type: "varchar" })
    brandId!: string;

    @Column({ type: "varchar", length: 255 })
    name!: string;

    @Column({ type: "varchar", length: 255, unique: true })
    slug!: string;

    @Column({ type: "varchar", length: 100, unique: true })
    sku!: string;

    @Column({ name: "short_description", type: "text", nullable: true })
    shortDescription!: string | null;

    @Column({ type: "text", nullable: true })
    description!: string | null;

    @Column({ type: "varchar", length: 500, nullable: true })
    thumbnail!: string | null;

    @Column({
        type: "decimal",
        precision: 15,
        scale: 2,
        transformer: numericTransformer
    })
    price!: number;

    @Column({
        name: "discount_price",
        type: "decimal",
        precision: 15,
        scale: 2,
        nullable: true,
        transformer: numericTransformer
    })
    discountPrice!: number | null;

    @Column({ type: "varchar", length: 30, default: "ACTIVE" })
    status!: string;

    @CreateDateColumn({ name: "created_at", type: "timestamp" })
    createdAt!: Date;

    @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
    updatedAt!: Date;

    @DeleteDateColumn({ name: "deleted_at", type: "timestamp", nullable: true })
    deletedAt!: Date | null;

    
    @ManyToOne(() => CategoryOrmEntity, { onDelete: "RESTRICT" })
    @JoinColumn({ name: "category_id" })
    category!: CategoryOrmEntity;

    @ManyToOne(() => BrandOrmEntity, { onDelete: "RESTRICT" })
    @JoinColumn({ name: "brand_id" })
    brand!: BrandOrmEntity;
}