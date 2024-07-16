/**
 * Simple template engine to replace variables in a string.
 */
export function template(
  str: string,
  variables: Record<string | number, any>,
  fallback?: string | ((key: string) => string),
): string {
  return str.replace(/\{(\w+)\}/g, (_, key) => {
    return variables[key] || ((typeof fallback === 'function' ? fallback(key) : fallback) ?? key)
  })
}

// Ported from `nanoid`
// See: https://github.com/ai/nanoid
const urlAlphabet = 'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict'

/**
 * Generates a random string.
 */
export function generateRandomId(size = 16, dict = urlAlphabet) {
  let id = ''
  let i = size
  const len = dict.length
  while (i--)
    id += dict[(Math.random() * len) | 0]
  return id
}

const RE_FULL_WHITESPACE = /^\s*$/

/**
 * Removes common leading whitespace from a template string while
 * also remove empty lines at the beginning and end.
 */
export function unindent(str: TemplateStringsArray | string) {
  const lines = (typeof str === 'string' ? str : str[0]).split('\n')
  const whitespaceLines = lines.map(line => RE_FULL_WHITESPACE.test(line))

  const commonIndent = lines
    .reduce((min, line, idx) => {
      if (whitespaceLines[idx])
        return min
      const indent = line.match(/^\s*/)?.[0].length
      return indent === undefined ? min : Math.min(min, indent)
    }, Number.POSITIVE_INFINITY)

  let emptyLinesHead = 0
  while (emptyLinesHead < lines.length && whitespaceLines[emptyLinesHead])
    emptyLinesHead++
  let emptyLinesTail = 0
  while (emptyLinesTail < lines.length && whitespaceLines[lines.length - emptyLinesTail - 1])
    emptyLinesTail++

  return lines
    .slice(emptyLinesHead, lines.length - emptyLinesTail)
    .map(line => line.slice(commonIndent))
    .join('\n')
}
