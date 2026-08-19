import { DomainError } from '../DomainError';

export class CategoryHasProductsError extends DomainError {
  constructor(id: string) {
    super(
      `Không thể xóa danh mục ID ${id} vì vẫn còn sản phẩm thuộc danh mục.`,
      400,
      'CATEGORY_HAS_PRODUCTS'
    );
  }
}
