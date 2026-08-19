import { DomainError } from '../DomainError';

export class BrandNotFoundError extends DomainError {
  constructor(id: string) {
    super(`Thương hiệu với ID: ${id} không tồn tại`, 404, "BRAND_NOT_FOUND");
  }
}