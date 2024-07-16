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

#### `createCsv`

Converts an array of objects to a comma-separated values (CSV) string that contains only the `columns` specified.

```ts
declare function createCsv<T extends Record<string, any>>(
  data: T[],
  columns: (keyof T)[],
  /** @default ',' */
  delimiter?: string
): string
```

#### `escapeCsvValue`

Escapes a value for a CSV string.

> [!NOTE]
> Returns an empty string if the value is `null` or `undefined`.

```ts
declare function escapeCsvValue(value: unknown): string
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

const mod = await interopDefault(import('./module.js'))
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

Generates a random string.

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
