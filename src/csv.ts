/**
 * Converts an array of objects to a comma-separated values (CSV) string
 * that contains only the `columns` specified.
 */
export function createCsv<T extends Record<string, any>>(
  data: T[],
  columns: (keyof T)[],
  /** @default ',' */
  delimiter = ',',
) {
  return [
    columns.join(delimiter),
    ...data.map(obj =>
      columns.map(key => `"${escapeCsvValue(obj[key])}"`).join(delimiter),
    ),
  ].join('\n')
}

export function escapeCsvValue(value: unknown) {
  if (value == null) {
    return ''
  }

  // Encode double quotes
  return value.toString().replace(/"/g, '""').replace(/\n/g, ' ')
}
