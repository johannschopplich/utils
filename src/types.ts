export type AutocompletableString = string & {}

export type LooseAutocomplete<T extends string> = T | AutocompletableString

/** Also commonly referred to as `Prettify` */
export type UnifyIntersection<T> = {
  [K in keyof T]: T[K]
} & {}

/**
 * A type that represents a value that can be either a success or a failure.
 */
export type Result<T> =
  | {
    ok: true
    value: T
  }
  | {
    ok: false
    error: unknown
  }
