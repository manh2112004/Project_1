export type Result<T, E> = Success<T, E> | Failure<T, E>;

export class Success<T, E> {
  readonly isSuccess = true as const;
  readonly isFailure = false as const;
  constructor(readonly value: T) {}
}

export class Failure<T, E> {
  readonly isSuccess = false as const;
  readonly isFailure = true as const;
  constructor(readonly error: E) {}
}

export const ok = <T, E = never>(value: T): Result<T, E> => new Success(value);
export const fail = <T = never, E = unknown>(error: E): Result<T, E> => new Failure(error);

export namespace ResultUtil {
  export function map<T, E, U>(result: Result<T, E>, fn: (val: T) => U): Result<U, E> {
    return result.isSuccess ? ok(fn(result.value)) : fail(result.error);
  }

  export function flatMap<T, E, U>(result: Result<T, E>, fn: (val: T) => Result<U, E>): Result<U, E> {
    return result.isSuccess ? fn(result.value) : fail(result.error);
  }
}
