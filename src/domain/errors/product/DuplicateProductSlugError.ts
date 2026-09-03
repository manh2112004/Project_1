import { DomainError } from '../DomainError';

export class DuplicateProductSlugError extends DomainError {
  constructor(slug: string) {
    super(`Slug sản phẩm '${slug}' đã tồn tại trong hệ thống.`, 400, "DUPLICATE_PRODUCT_SLUG");
  }
}
