import { DomainError } from '../DomainError';

export class ProductNotFoundError extends DomainError {
  constructor(identifier: string) {
    super(`Sản phẩm với ID hoặc mã '${identifier}' không tồn tại.`, 404, "PRODUCT_NOT_FOUND");
  }
}
