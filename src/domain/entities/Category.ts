import { randomUUID } from 'crypto';
import { Result, ok, fail } from '../common/Result';
import { DomainError } from '../errors/DomainError';

export interface CategoryProps {
  id?: string;
  parentId?: string | null;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface UpdateCategoryProps {
  id: string;
  name?: string;
  slug?: string;
  parentId?: string | null;
  description?: string | null;
  image?: string | null;
  isActive?: boolean;
}

export class Category {
  public readonly id: string;
  public parentId: string | null;
  public name: string;
  public slug: string;
  public description: string | null;
  public image: string | null;
  public isActive: boolean;
  public readonly createdAt: Date;
  public updatedAt: Date;
  public deletedAt: Date | null;

  constructor(props: CategoryProps) {
    this.id = props.id || randomUUID();
    this.parentId = props.parentId || null;
    this.name = props.name;
    this.slug = props.slug;
    this.description = props.description || null;
    this.image = props.image || null;
    this.isActive = props.isActive !== undefined ? props.isActive : true;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
    this.deletedAt = props.deletedAt || null;
  }

  public static create(props: {
    name: string;
    slug?: string;
    parentId?: string | null;
    description?: string | null;
    image?: string | null;
    isActive?: boolean;
  }): Result<Category, DomainError> {
    if (!props.name || props.name.trim().length === 0) {
      return fail(new DomainError('Tên danh mục (name) không được để trống.', 400, 'INVALID_CATEGORY_NAME'));
    }

    const generatedSlug = props.slug && props.slug.trim().length > 0
      ? Category.slugify(props.slug)
      : Category.slugify(props.name);

    const category = new Category({
      name: props.name.trim(),
      slug: generatedSlug,
      parentId: props.parentId || null,
      description: props.description || null,
      image: props.image || null,
      isActive: props.isActive !== undefined ? props.isActive : true,
    });

    return ok(category);
  }

  public update(props: UpdateCategoryProps): Result<void, DomainError> {
    if (props.name !== undefined) {
      if (!props.name || props.name.trim().length === 0) {
        return fail(new DomainError('Tên danh mục không được để trống', 400, 'INVALID_CATEGORY_NAME'));
      }
      this.name = props.name.trim();
    }
    if (props.slug !== undefined) {
      this.slug = props.slug.trim().length > 0 ? Category.slugify(props.slug) : Category.slugify(this.name);
    }
    this.parentId = props.parentId !== undefined ? props.parentId : this.parentId;
    this.description = props.description !== undefined ? props.description : this.description;
    this.image = props.image !== undefined ? props.image : this.image;
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

