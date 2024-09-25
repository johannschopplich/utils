export type CSVRow<T extends string = string> = Record<T, string>

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
    addHeader?: boolean
    /** @default false */
    quoteAll?: boolean
  } = {},
) {
  const {
    delimiter = ',',
    addHeader = true,
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

  if (addHeader) {
    rows.unshift(columns.map(escapeAndQuote).join(delimiter))
  }

  return rows.join('\n')
}

/**
 * Parses a comma-separated values (CSV) string into an array of objects.
 *
 * @remarks
 * The first row of the CSV string is used as the header row.
 */
export function parseCSV<Header extends string>(csv: string): CSVRow<Header>[] {
  // Split the CSV string into rows
  const rows = csv.trim().split('\n')

  const [header, ...rest] = rows
  if (!header || !rest.length)
    return []

  const headers = parseCSVLine(header)

  return rest.map((row) => {
    const values = parseCSVLine(row)

    return Object.fromEntries(
      headers.map((header, index) => [header, values[index]!]),
    ) as CSVRow<Header>
  })
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

function parseCSVLine(input: string): string[] {
  return input.split(',').map(item => item.trim())
}
