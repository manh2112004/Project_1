import { DomainError } from '../DomainError';

export class DuplicateSlugError extends DomainError {
    constructor(slug: string) {
        super(`Slug: ${slug} đã được sử dụng bởi danh mục khác`, 409, "DUPLICATE_SLUG");
    }
}