import { DomainError } from '../DomainError';
export class CategoryNotFoundError extends DomainError{
    constructor(id:string){
        super(`Danh mục với ID: ${id} không tồn tại`,404);
    }
}