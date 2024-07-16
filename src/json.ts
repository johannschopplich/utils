/**
 * Type-safe wrapper around `JSON.stringify` falling back to the original value
 * if it is not a string or an error is thrown.
 */
export function tryParseJson<T = unknown>(value: unknown): T {
  if (typeof value !== 'string') {
    return value as T
  }

  try {
    return JSON.parse(value)
  }
  catch {
    return value as T
  }
}

/**
 * Clones the given JSON value.
 */
export default function cloneJson<T>(value: T): T {
  if (typeof value !== 'object' || value === null) {
    return value
  }

  else if (Array.isArray(value)) {
    return value.map(e => (typeof e !== 'object' || e === null ? e : cloneJson(e))) as T
  }

  else {
    const result: Record<string, unknown> = {}

    for (const k in value) {
      const v = value[k]
      result[k] = typeof v !== 'object' || v === null ? v : cloneJson(v)
    }

    return result as T
  }
}
