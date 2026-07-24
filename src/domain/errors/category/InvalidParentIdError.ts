import { DomainError } from '../DomainError';

export class InvalidParentIdError extends DomainError {
  constructor(message: string = 'Danh mục cha không hợp lệ.') {
    super(message, 400);
  }
}
