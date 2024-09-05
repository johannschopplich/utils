export type QueryValue = string | number | boolean | QueryValue[] | Record<string, any> | null | undefined
export type QueryObject = Record<string, QueryValue | QueryValue[]>

/**
 * Removes the leading slash from the given path if it has one.
 */
export function withoutLeadingSlash(path?: string): string {
  if (!path || path === '/') {
    return '/'
  }

  return path[0] === '/' ? path.slice(1) : path
}

/**
 * Adds a leading slash to the given path if it does not already have one.
 */
export function withLeadingSlash(path?: string): string {
  if (!path || path === '/') {
    return '/'
  }

  return path[0] === '/' ? path : `/${path}`
}

/**
 * Removes the trailing slash from the given path if it has one.
 */
export function withoutTrailingSlash(path?: string): string {
  if (!path || path === '/') {
    return '/'
  }

  return path[path.length - 1] === '/' ? path.slice(0, -1) : path
}

/**
 * Adds a trailing slash to the given path if it does not already have one
 */
export function withTrailingSlash(path?: string): string {
  if (!path || path === '/') {
    return '/'
  }

  return path[path.length - 1] === '/' ? path : `${path}/`
}

/**
 * Joins the given base URL and path, ensuring that there is only one slash between them.
 */
export function joinURL(
  base?: string,
  path?: string,
): string {
  if (!base || base === '/') {
    return path || '/'
  }

  if (!path || path === '/') {
    return base || '/'
  }

  const baseHasTrailing = base[base.length - 1] === '/'
  const pathHasLeading = path[0] === '/'
  if (baseHasTrailing && pathHasLeading) {
    return base + path.slice(1)
  }

  if (!baseHasTrailing && !pathHasLeading) {
    return `${base}/${path}`
  }

  return base + path
}

/**
 * Adds the base path to the input path, if it is not already present.
 */
export function withBase(input = '', base = ''): string {
  if (!base || base === '/') {
    return input
  }

  const _base = withoutTrailingSlash(base)
  if (input.startsWith(_base)) {
    return input
  }

  return joinURL(_base, input)
}

/**
 * Removes the base path from the input path, if it is present.
 */
export function withoutBase(input = '', base = ''): string {
  if (!base || base === '/') {
    return input
  }

  const _base = withoutTrailingSlash(base)
  if (!input.startsWith(_base)) {
    return input
  }

  const trimmed = input.slice(_base.length)
  return trimmed[0] === '/' ? trimmed : `/${trimmed}`
}

/**
 * Returns the pathname of the given path, which is the path without the query string.
 */
export function getPathname(path = '/'): string {
  return path.startsWith('/')
    ? path.split('?')[0]
    : new URL(path, 'http://localhost').pathname
}

/**
 * Returns the URL with the given query parameters. If a query parameter is undefined, it is omitted.
 */
export function withQuery(input: string, query?: QueryObject): string {
  if (!query || Object.keys(query).length === 0) {
    return input
  }

  const searchIndex = input.indexOf('?')
  const base = searchIndex === -1 ? input : input.slice(0, searchIndex)
  const searchParams = new URLSearchParams(searchIndex === -1 ? '' : input.slice(searchIndex + 1))

  for (const [key, value] of Object.entries(query)) {
    if (value === undefined) {
      searchParams.delete(key)
    }
    else if (typeof value === 'number' || typeof value === 'boolean') {
      searchParams.set(key, String(value))
    }
    else if (!value) {
      searchParams.set(key, '')
    }
    else if (Array.isArray(value)) {
      for (const item of value) {
        searchParams.append(key, String(item))
      }
    }
    else if (typeof value === 'object') {
      searchParams.set(key, JSON.stringify(value))
    }
    else {
      searchParams.set(key, String(value))
    }
  }

  const queryString = searchParams.toString()
  return queryString ? `${base}?${queryString}` : base
}
