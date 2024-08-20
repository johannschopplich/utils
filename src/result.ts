export type Result<T, E> = Ok<T> | Err<E>

export class Ok<T> {
  readonly ok = true as const
  constructor(public value: T) { }
}

export class Err<E> {
  readonly ok = false as const
  constructor(public error: E) { }
}

export const ok = <T>(value: T): Ok<T> => new Ok(value)
export const err = <E>(error: E): Err<E> => new Err(error)

export function trySafe<T, E = unknown>(fn: () => T): Result<T, E>
export function trySafe<T, E = unknown>(promise: Promise<T>): Promise<Result<T, E>>
export function trySafe<T, E = unknown>(
  fnOrPromise: (() => T) | Promise<T>,
): Result<T, E> | Promise<Result<T, E>> {
  if (fnOrPromise instanceof Promise) {
    return fnOrPromise
      .then(value => new Ok(value))
      .catch(error => new Err(error as E))
  }

  try {
    return new Ok(fnOrPromise())
  }
  catch (error) {
    return new Err(error as E)
  }
}
