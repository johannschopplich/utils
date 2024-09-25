# @byjohann/utils

A collection of utility functions that I use across my JavaScript and TypeScript projects.

## Installation

Run the following command to add `@byjohann/utils` to your project.

```bash
# npm
npm install -D @byjohann/utils

# pnpm
pnpm add -D @byjohann/utils

# yarn
yarn add -D @byjohann/utils
```

## API

### Array

#### `toArray`

Converts `MaybeArray<T>` to `Array<T>`.

```ts
type MaybeArray<T> = T | T[]

declare function toArray<T>(array?: MaybeArray<T> | null | undefined): T[]
```

### CSV

#### `createCSV`

Converts an array of objects to a comma-separated values (CSV) string that contains only the `columns` specified.

```ts
declare function createCSV<T extends Record<string, unknown>>(
  data: T[],
  columns: (keyof T)[],
  options?: {
    /** @default ',' */
    delimiter?: string
    /** @default true */
    includeHeaders?: boolean
    /** @default false */
    quoteAll?: boolean
  }
): string
```

#### `parseCSV`

Parses a comma-separated values (CSV) string into an array of objects.

> [!NOTE]
> The first row of the CSV string is used as the header row.

```ts
type CSVRow<T extends string = string> = Record<T, string>

declare function parseCSV<Header extends string>(csv: string): CSVRow<Header>[]
```

#### `escapeCSVValue`

Escapes a value for a CSV string.

> [!NOTE]
> Returns an empty string if the value is `null` or `undefined`.

```ts
declare function escapeCSVValue(value: unknown, { delimiter, quoteAll, }?: {
  /** @default ',' */
  delimiter?: string
  /** @default false */
  quoteAll?: boolean
}): string
```

### JSON

#### `tryParseJSON`

Type-safe wrapper around `JSON.stringify` falling back to the original value if it is not a string or an error is thrown.

```ts
declare function tryParseJSON<T = unknown>(value: unknown): T
```

#### `cloneJSON`

Clones the given JSON value.

> [!NOTE]
> The value must not contain circular references as JSON does not support them. It also must contain JSON serializable values.

```ts
declare function cloneJSON<T>(value: T): T
```

### Module

#### `interopDefault`

Interop helper for default exports.

```ts
declare function interopDefault<T>(m: T | Promise<T>): Promise<T extends {
  default: infer U
} ? U : T>
```

**Example:**

```ts
import { interopDefault } from '@byjohann/utils'

async function loadModule() {
  const mod = await interopDefault(import('./module.js'))
}
```

### Object

#### `objectKeys`

Strictly typed `Object.keys`.

```ts
declare function objectKeys<T extends Record<any, any>>(obj: T): Array<`${keyof T & (string | number | boolean | null | undefined)}`>
```

#### `objectEntries`

Strictly typed `Object.entries`.

```ts
declare function objectEntries<T extends Record<any, any>>(obj: T): Array<[keyof T, T[keyof T]]>
```

#### `deepApply`

Deeply applies a callback to every key-value pair in the given object, as well as nested objects and arrays.

```ts
declare function deepApply<T extends Record<any, any>>(data: T, callback: (item: T, key: keyof T, value: T[keyof T]) => void): void
```

### Path

#### `withoutLeadingSlash`

Removes the leading slash from the given path if it has one.

```ts
declare function withoutLeadingSlash(path?: string): string
```

#### `withLeadingSlash`

Adds a leading slash to the given path if it does not already have one.

```ts
declare function withLeadingSlash(path?: string): string
```

#### `withoutTrailingSlash`

Removes the trailing slash from the given path if it has one.

```ts
declare function withoutTrailingSlash(path?: string): string
```

#### `withTrailingSlash`

Adds a trailing slash to the given path if it does not already have one.

```ts
declare function withTrailingSlash(path?: string): string
```

#### `joinURL`

Joins the given base URL and path, ensuring that there is only one slash between them.

```ts
declare function joinURL(base?: string, path?: string): string
```

#### `withBase`

Adds the base path to the input path, if it is not already present.

```ts
declare function withBase(input?: string, base?: string): string
```

#### `withoutBase`

Removes the base path from the input path, if it is present.

```ts
declare function withoutBase(input?: string, base?: string): string
```

#### `getPathname`

Returns the pathname of the given path, which is the path without the query string.

```ts
declare function getPathname(path?: string): string
```

#### `withQuery`

Returns the URL with the given query parameters. If a query parameter is undefined, it is omitted.

```ts
declare function withQuery(input: string, query?: QueryObject): string
```

**Example:**

```ts
import { withQuery } from '@byjohann/utils'

const url = withQuery('https://example.com', {
  foo: 'bar',
  // This key is omitted
  baz: undefined,
  // Object values are stringified
  baz: { qux: 'quux' }
})
```

### String

#### `template`

Simple template engine to replace variables in a string.

```ts
declare function template(str: string, variables: Record<string | number, any>, fallback?: string | ((key: string) => string)): string
```

**Example:**

```ts
import { template } from '@byjohann/utils'

const str = 'Hello, {name}!'
const variables = { name: 'world' }

console.log(template(str, variables)) // Hello, world!
```

#### `generateRandomId`

Generates a random string. The function is ported from [`nanoid`](https://github.com/ai/nanoid). You can specify the size of the string and the dictionary of characters to use.

```ts
declare function generateRandomId(size?: number, dict?: string): string
```

#### `unindent`

Removes common leading whitespace from a template string while also removing empty lines at the beginning and end.

```ts
declare function unindent(str: TemplateStringsArray | string): string
```

## License

[MIT](./LICENSE) License © 2024-PRESENT [Johann Schopplich](https://github.com/johannschopplich)
