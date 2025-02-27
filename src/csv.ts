/**
 * Represents a row in a CSV file with column names of type T.
 */
export type CSVRow<T extends string = string> = Record<T, string>

/**
 * Converts an array of objects to a comma-separated values (CSV) string
 * that contains only the `columns` specified.
 *
 * @example
 * const data = [
 *   { name: 'John', age: '30', city: 'New York' },
 *   { name: 'Jane', age: '25', city: 'Boston' }
 * ]
 *
 * const csv = createCSV(data, ['name', 'age'])
 * // name,age
 * // John,30
 * // Jane,25
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

  // Pre-configure the escaper function to avoid recreating it in each iteration
  const escapeAndQuote = (value: unknown) =>
    escapeCSVValue(value, { delimiter, quoteAll })

  // Preallocate an array for better performance with large datasets
  const rows = Array.from<string>({ length: addHeader ? data.length + 1 : data.length })

  // Process header first if needed
  let rowIndex = 0
  if (addHeader) {
    rows[rowIndex++] = columns.map(escapeAndQuote).join(delimiter)
  }

  // Process data rows
  for (let i = 0; i < data.length; i++) {
    rows[rowIndex++] = columns.map(key => escapeAndQuote(data[i][key])).join(delimiter)
  }

  return rows.join('\n')
}

/**
 * Escapes a value for a CSV string.
 *
 * @remarks
 * Returns an empty string if the value is `null` or `undefined`.
 *
 * @example
 * escapeCSVValue('hello, world'); // "hello, world"
 * escapeCSVValue('contains "quotes"'); // "contains ""quotes"""
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
 *
 * @example
 * const csv = `name,age
 * John,30
 * Jane,25`
 *
 * const data = parseCSV<'name' | 'age'>(csv)
 * // [{ name: 'John', age: '30' }, { name: 'Jane', age: '25' }]
 */
export function parseCSV<Header extends string>(
  csv: string,
  options: {
    /** @default ',' */
    delimiter?: string
    /** @default true */
    trimValues?: boolean
  } = {},
): CSVRow<Header>[] {
  const {
    delimiter = ',',
    trimValues = true,
  } = options

  // Split the CSV string into rows
  const rows = csv.trim().split(/\r?\n/)

  const [header, ...rest] = rows
  if (!header || !rest.length)
    return []

  const headers = parseCSVLine(header, { delimiter, trimValues })

  return rest.map((row) => {
    if (!row.trim())
      return {} as CSVRow<Header> // Skip empty rows

    const values = parseCSVLine(row, { delimiter, trimValues })

    return Object.fromEntries(
      headers.map((header, index) => [header, values[index] ?? '']),
    ) as CSVRow<Header>
  }).filter(row => Object.keys(row).length > 0) // Filter out empty rows
}

/**
 * Parses a single CSV line into an array of values.
 * Correctly handles quoted fields containing delimiters and escaped quotes.
 */
function parseCSVLine(
  input: string,
  {
    delimiter = ',',
    trimValues = true,
  }: {
    delimiter: string
    trimValues: boolean
  },
): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < input.length; i++) {
    const char = input[i]

    if (char === '"') {
      // Check for escaped quotes (two double quotes in sequence)
      if (inQuotes && i + 1 < input.length && input[i + 1] === '"') {
        current += '"'
        i++ // Skip the next quote
      }
      else {
        // Toggle quote mode
        inQuotes = !inQuotes
      }
    }
    else if (char === delimiter && !inQuotes) {
      // End of field
      result.push(trimValues ? current.trim() : current)
      current = ''
    }
    else {
      current += char
    }
  }

  // Push the last field
  result.push(trimValues ? current.trim() : current)

  return result
}
