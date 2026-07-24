import { randomUUID } from "crypto";
export interface BrandProps {
    id?: string;
    name: string;
    logo: string | null;
    description?: string | null;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
}
export interface UpdateBrandProps {
    id: string;
    name?: string;
    description?: string | null;
    logo?: string | null;
    isActive?: boolean;
}
export class Brand {
    public readonly id: string;
    public name: string;
    public logo: string | null;
    public description: string | null;
    public isActive: boolean;
    public readonly createdAt: Date;
    public updatedAt: Date;
    public deletedAt: Date | null;
    constructor(props: BrandProps) {
        {
            this.id = props.id || randomUUID();
            this.name = props.name;
            this.logo = props.logo;
            this.description = props.description ?? null;
            this.isActive = props.isActive !== undefined ? props.isActive : true;
            this.createdAt = props.createdAt || new Date();
            this.updatedAt = props.updatedAt || new Date();
            this.deletedAt = props.deletedAt || null;
        }
    }
    public static create(props: {
        name: string | null;
        logo: string | null;
        description: string | null;
        isActive?: boolean;
    }): Brand {
        if (!props.name || props.name.trim().length === 0) {
            throw new Error("Tên thương hiệu (name) không được để trống.");
        }
        return new Brand({
            name: props.name,
            logo: props.logo,
            description: props.description,
            isActive: props.isActive,
        });
    }
    public update(props: UpdateBrandProps): void {
        if (props.name !== undefined) {
            if (!props.name || props.name.trim().length === 0) {
                throw new Error("Tên thương hiệu không được để trống")
            }
            this.name = props.name.trim();
        }
        this.description = props.description !== undefined ? props.description : this.description
        this.logo = props.logo !== undefined ? props.logo : this.logo
        this.isActive = props.isActive !== undefined ? props.isActive : this.isActive
        this.updatedAt = new Date();
    }
    public delete(): void {
        this.deletedAt = new Date();
        this.isActive = false;
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