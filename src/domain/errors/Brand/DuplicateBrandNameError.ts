import { DomainError } from '../DomainError';

export class DuplicateBrandNameError extends DomainError {
  constructor(name: string) {
    super(`Thương hiệu với tên '${name}' đã tồn tại.`, 409, "DUPLICATE_BRAND_NAME");
  }
}
