export function tryParseJson<T = unknown>(value: unknown): T {
  if (typeof value !== 'string') {
    return value as T
  }

  try {
    return JSON.parse(value)
  }
  catch (error) {
    console.error('Failed to parse JSON string:', error)
    return value as T
  }
}
