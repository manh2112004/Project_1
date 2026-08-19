import { randomUUID } from "crypto";
import { Result, ok, fail } from "../common/Result";
import { DomainError } from "../errors/DomainError";

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
    this.id = props.id || randomUUID();
    this.name = props.name;
    this.logo = props.logo;
    this.description = props.description ?? null;
    this.isActive = props.isActive !== undefined ? props.isActive : true;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
    this.deletedAt = props.deletedAt || null;
  }

  public static create(props: {
    name: string | null;
    logo: string | null;
    description: string | null;
    isActive?: boolean;
  }): Result<Brand, DomainError> {
    if (!props.name || props.name.trim().length === 0) {
      return fail(new DomainError("Tên thương hiệu (name) không được để trống.", 400, "INVALID_BRAND_NAME"));
    }
    return ok(
      new Brand({
        name: props.name.trim(),
        logo: props.logo,
        description: props.description,
        isActive: props.isActive,
      })
    );
  }

  public update(props: UpdateBrandProps): Result<void, DomainError> {
    if (props.name !== undefined) {
      if (!props.name || props.name.trim().length === 0) {
        return fail(new DomainError("Tên thương hiệu không được để trống.", 400, "INVALID_BRAND_NAME"));
      }
      this.name = props.name.trim();
    }
    this.description = props.description !== undefined ? props.description : this.description;
    this.logo = props.logo !== undefined ? props.logo : this.logo;
    this.isActive = props.isActive !== undefined ? props.isActive : this.isActive;
    this.updatedAt = new Date();

    return ok(undefined);
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