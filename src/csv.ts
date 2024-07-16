/**
 * Converts an array of objects to a comma-separated values (CSV) string
 * that contains only the `columns` specified.
 */
export function createCSV<T extends Record<string, unknown>>(
  data: T[],
  columns: (keyof T)[],
  options: {
    /** @default ',' */
    delimiter?: string
    /** @default true */
    includeHeaders?: boolean
    /** @default false */
    quoteAll?: boolean
  } = {},
) {
  const {
    delimiter = ',',
    includeHeaders = true,
    quoteAll = false,
  } = options

  const escapeAndQuote = (value: unknown) => {
    const escaped = escapeCSVValue(value)
    return quoteAll || escaped.includes(delimiter) || escaped.includes('"') || escaped.includes('\n')
      ? `"${escaped}"`
      : escaped
  }

  const rows = data.map(obj =>
    columns.map(key => escapeAndQuote(obj[key])).join(delimiter),
  )

  if (includeHeaders) {
    rows.unshift(columns.map(escapeAndQuote).join(delimiter))
  }

  return rows.join('\n')
}

/**
 * Escapes a value for a CSV string.
 *
 * @remarks
 * Returns an empty string if the value is `null` or `undefined`.
 */
export function escapeCSVValue(value: unknown) {
  if (value == null) {
    return ''
  }

  // Encode double quotes
  return value.toString()
    .replaceAll('"', '""')
    .replaceAll('\n', ' ')
}
