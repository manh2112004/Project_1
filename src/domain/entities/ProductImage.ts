import { randomUUID } from "crypto";

export interface ProductImageProps {
    id?: string;
    productId: string;
    imageUrl: string;
    isThumbnail?: boolean;
    sortOrder?: number;
    createdAt?: Date;
}

export interface UpdateProductImageProps {
    isThumbnail?: boolean;
    sortOrder?: number;
}

export class ProductImage {
    public readonly id: string;
    public readonly productId: string;
    public imageUrl: string;
    public isThumbnail: boolean;
    public sortOrder: number;
    public readonly createdAt: Date;

    constructor(props: ProductImageProps) {
        this.id = props.id || randomUUID();
        this.productId = props.productId;
        this.imageUrl = props.imageUrl;
        this.isThumbnail = props.isThumbnail !== undefined ? props.isThumbnail : false;
        this.sortOrder = props.sortOrder !== undefined ? props.sortOrder : 0;
        this.createdAt = props.createdAt || new Date();
    }

    public static create(props: {
        productId: string;
        imageUrl: string;
        isThumbnail?: boolean;
        sortOrder?: number;
    }): ProductImage {
        if (!props.productId || props.productId.trim().length === 0) {
            throw new Error("Mã sản phẩm (productId) không được để trống.");
        }
        if (!props.imageUrl || props.imageUrl.trim().length === 0) {
            throw new Error("Đường dẫn ảnh (imageUrl) không được để trống.");
        }

        return new ProductImage({
            productId: props.productId,
            imageUrl: props.imageUrl,
            isThumbnail: props.isThumbnail,
            sortOrder: props.sortOrder,
        });
    }

    public update(props: UpdateProductImageProps): void {
        if (props.isThumbnail !== undefined) {
            this.isThumbnail = props.isThumbnail;
        }
        if (props.sortOrder !== undefined) {
            this.sortOrder = props.sortOrder;
        }
    }
}
