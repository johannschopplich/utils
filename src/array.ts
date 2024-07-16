export type MaybeArray<T> = T | T[]

/**
 * Converts `MaybeArray<T>` to `Array<T>`.
 */
export function toArray<T>(array?: MaybeArray<T> | null | undefined): T[] {
  array ??= []
  return Array.isArray(array) ? array : [array]
}
