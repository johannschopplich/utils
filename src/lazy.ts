/**
 * A simple general purpose memoizer utility.
 * - Lazily computes a value when accessed
 * - Auto-caches the result by overwriting the getter
 * - Typesafe
 *
 * @remarks
 * Useful for deferring initialization or expensive operations. Unlike a simple getter, there is no runtime overhead after the first invokation, since the getter itself is overwritten with the memoized value.
 *
 * @example
 * const myValue = lazy(() => 'Hello, World!')
 * console.log(myValue.value) // Computes value, overwrites getter
 * console.log(myValue.value) // Returns cached value
 * console.log(myValue.value) // Returns cached value
 */
export function lazy<T>(getter: () => T): { value: T } {
  return {
    get value() {
      const value = getter()
      Object.defineProperty(this, 'value', { value })
      return value
    },
  }
}
