import { DomainError } from '../DomainError';

export class DuplicateSkuError extends DomainError {
  constructor(sku: string) {
    super(`Mã SKU '${sku}' đã tồn tại trong hệ thống.`, 400, "DUPLICATE_SKU");
  }
}
