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

  const escapeAndQuote = (value: unknown) =>
    escapeCSVValue(value, { delimiter, quoteAll })

  const rows = data.map(obj =>
    columns.map(key => escapeAndQuote(obj[key])).join(delimiter),
  )

  if (addHeader) {
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
export function escapeCSVValue(value: unknown, {
  delimiter = ',',
  quoteAll = false,
}: {
  /** @default ',' */
  delimiter?: string
  /** @default false */
  quoteAll?: boolean
} = {}) {
  if (value == null) {
    return ''
  }

  const stringValue = value.toString()
  const needsQuoting = quoteAll
    || stringValue.includes(delimiter)
    || stringValue.includes('"')
    || stringValue.includes('\n')
    || stringValue.includes('\r')

  if (needsQuoting) {
    // Encode double quotes and wrap the entire value in quotes
    return `"${stringValue.replaceAll('"', '""')}"`
  }

  return stringValue
}

/**
 * Parses a comma-separated values (CSV) string into an array of objects.
 *
 * @remarks
 * The first row of the CSV string is used as the header row.
 */
export function parseCSV<Header extends string>(csv: string): CSVRow<Header>[] {
  // Split the CSV string into rows
  const rows = csv.trim().split(/\r?\n/)

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

function parseCSVLine(input: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < input.length; i++) {
    const char = input[i]

    if (char === '"') {
      if (inQuotes && input[i + 1] === '"') {
        // Double quotes inside quoted field
        current += '"'
        i++ // Skip the next quote
      }
      else {
        // Toggle quote mode
        inQuotes = !inQuotes
      }
    }
    else if (char === ',' && !inQuotes) {
      // End of field
      result.push(current)
      current = ''
    }
    else {
      current += char
    }
  }

  // Push the last field
  result.push(current)

  return result.map(field => field.trim())
}
