export interface IDomainError {
    readonly code: string;
    readonly message: string;
    readonly statusCode?: number;
    readonly details?: any;
}

export class DomainError extends Error implements IDomainError {
    public readonly code: string;
    public readonly statusCode: number;
    public readonly details?: any;

    constructor(message: string, statusCode: number = 400, code: string = "DOMAIN_ERROR", details?: any) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}