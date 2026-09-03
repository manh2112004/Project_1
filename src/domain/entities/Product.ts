import { randomUUID } from "crypto";
import { Result, ok, fail } from "../common/Result";
import { DomainError } from "../errors/DomainError";

export interface ProductProps {
    id?: string;
    storeId?: string | null;
    categoryId: string;
    brandId: string;
    name: string;
    slug?: string;
    sku: string;
    shortDescription?: string | null;
    description?: string | null;
    thumbnail?: string | null;
    price: number;
    discountPrice?: number | null;
    status?: string;
    store?: any;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
}

export interface UpdateProductProps {
    id: string;
    storeId?: string | null;
    categoryId?: string;
    brandId?: string;
    name?: string;
    slug?: string;
    sku?: string;
    shortDescription?: string | null;
    description?: string | null;
    thumbnail?: string | null;
    price?: number;
    discountPrice?: number | null;
    status?: string;
}

export class Product {
    public readonly id: string;
    public storeId: string | null;
    public categoryId: string;
    public brandId: string;
    public name: string;
    public slug: string;
    public sku: string;
    public shortDescription: string | null;
    public description: string | null;
    public thumbnail: string | null;
    public price: number;
    public discountPrice: number | null;
    public status: string;
    public store?: any;
    public readonly createdAt: Date;
    public updatedAt: Date;
    public deletedAt: Date | null;

    constructor(props: ProductProps) {
        this.id = props.id || randomUUID();
        this.storeId = props.storeId ?? null;
        this.categoryId = props.categoryId;
        this.brandId = props.brandId;
        this.name = props.name;
        this.slug = props.slug || Product.slugify(props.name);
        this.sku = props.sku;
        this.shortDescription = props.shortDescription ?? null;
        this.description = props.description ?? null;
        this.thumbnail = props.thumbnail ?? null;
        this.price = props.price;
        this.discountPrice = props.discountPrice ?? null;
        this.status = props.status || "ACTIVE";
        this.store = props.store;
        this.createdAt = props.createdAt || new Date();
        this.updatedAt = props.updatedAt || new Date();
        this.deletedAt = props.deletedAt || null;
    }

    public static create(props: {
        storeId?: string | null;
        categoryId: string;
        brandId: string;
        name: string;
        slug?: string;
        sku: string;
        shortDescription?: string | null;
        description?: string | null;
        thumbnail?: string | null;
        price: number;
        discountPrice?: number | null;
        status?: string;
    }): Result<Product, DomainError> {
        if (!props.name || props.name.trim().length === 0) {
            return fail(new DomainError("Tên sản phẩm không được để trống.", 400, "INVALID_PRODUCT_NAME"));
        }
        if (!props.sku || props.sku.trim().length === 0) {
            return fail(new DomainError("Mã SKU không được để trống.", 400, "INVALID_PRODUCT_SKU"));
        }
        if (props.price < 0) {
            return fail(new DomainError("Giá sản phẩm không được nhỏ hơn 0.", 400, "INVALID_PRODUCT_PRICE"));
        }
        if (props.discountPrice !== undefined && props.discountPrice !== null) {
            if (props.discountPrice < 0) {
                return fail(new DomainError("Giá khuyến mãi không được nhỏ hơn 0.", 400, "INVALID_DISCOUNT_PRICE"));
            }
            if (props.discountPrice > props.price) {
                return fail(new DomainError("Giá khuyến mãi không được lớn hơn giá gốc sản phẩm.", 400, "INVALID_DISCOUNT_PRICE"));
            }
        }

        const generatedSlug = props.slug && props.slug.trim().length > 0
            ? Product.slugify(props.slug)
            : Product.slugify(props.name);

        const product = new Product({
            storeId: props.storeId,
            categoryId: props.categoryId,
            brandId: props.brandId,
            name: props.name.trim(),
            slug: generatedSlug,
            sku: props.sku.trim().toUpperCase(),
            shortDescription: props.shortDescription,
            description: props.description,
            thumbnail: props.thumbnail,
            price: props.price,
            discountPrice: props.discountPrice,
            status: props.status,
        });

        return ok(product);
    }

    public update(props: UpdateProductProps): Result<void, DomainError> {
        if (props.name !== undefined) {
            if (!props.name.trim()) {
                return fail(new DomainError("Tên sản phẩm không được để trống.", 400, "INVALID_PRODUCT_NAME"));
            }
            this.name = props.name.trim();
        }
        if (props.slug !== undefined) {
            this.slug = props.slug.trim().length > 0
                ? Product.slugify(props.slug)
                : Product.slugify(this.name);
        } else if (props.name !== undefined && !this.slug) {
            this.slug = Product.slugify(this.name);
        }
        if (props.price !== undefined) {
            if (props.price < 0) {
                return fail(new DomainError("Giá sản phẩm không được nhỏ hơn 0.", 400, "INVALID_PRODUCT_PRICE"));
            }
            this.price = props.price;
        }
        if (props.discountPrice !== undefined) {
            if (props.discountPrice !== null) {
                if (props.discountPrice < 0) {
                    return fail(new DomainError("Giá khuyến mãi không được nhỏ hơn 0.", 400, "INVALID_DISCOUNT_PRICE"));
                }
                const targetPrice = props.price !== undefined ? props.price : this.price;
                if (props.discountPrice > targetPrice) {
                    return fail(new DomainError("Giá khuyến mãi không được lớn hơn giá gốc sản phẩm.", 400, "INVALID_DISCOUNT_PRICE"));
                }
            }
            this.discountPrice = props.discountPrice;
        }
        if (props.sku !== undefined) {
            if (!props.sku.trim()) {
                return fail(new DomainError("Mã SKU không được để trống.", 400, "INVALID_PRODUCT_SKU"));
            }
            this.sku = props.sku.trim().toUpperCase();
        }
        this.storeId = props.storeId !== undefined ? props.storeId : this.storeId;
        this.categoryId = props.categoryId !== undefined ? props.categoryId : this.categoryId;
        this.brandId = props.brandId !== undefined ? props.brandId : this.brandId;
        this.shortDescription = props.shortDescription !== undefined ? props.shortDescription : this.shortDescription;
        this.description = props.description !== undefined ? props.description : this.description;
        this.thumbnail = props.thumbnail !== undefined ? props.thumbnail : this.thumbnail;
        this.status = props.status !== undefined ? props.status : this.status;
        this.updatedAt = new Date();

        return ok(undefined);
    }

    public delete(): void {
        this.deletedAt = new Date();
        this.status = "DELETED";
    }

    public static slugify(text: string): string {
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[đĐ]/g, 'd')
            .replace(/[^a-z0-9\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-');
    }
}