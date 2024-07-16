import type { MaybeArray } from './types'

/**
 * Converts `MaybeArray<T>` to `Array<T>`.
 */
export function toArray<T>(array?: MaybeArray<T> | null | undefined): T[] {
  array = array ?? []
  return Array.isArray(array) ? array : [array]
}
