# utilful

A collection of TypeScript utilities that I use across my projects.

## Table of Contents

- [Installation](#installation)
- [API](#api)
  - [Array](#array)
  - [CSV](#csv)
  - [Emitter](#emitter)
  - [JSON](#json)
  - [Lazy](#lazy)
  - [Module](#module)
  - [Object](#object)
  - [Path](#path)
  - [String](#string)

## Installation

Run the following command to add `utilful` to your project.

```bash
# npm
npm install -D utilful

# pnpm
pnpm add -D utilful

# yarn
yarn add -D utilful
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

**Example:**

```ts
const data = [
  { name: 'John', age: '30', city: 'New York' },
  { name: 'Jane', age: '25', city: 'Boston' }
]

const csv = createCSV(data, ['name', 'age'])
// name,age
// John,30
// Jane,25
```

#### `parseCSV`

Parses a comma-separated values (CSV) string into an array of objects.

> [!NOTE]
> The first row of the CSV string is used as the header row.

```ts
type CSVRow<T extends string = string> = Record<T, string>

declare function parseCSV<Header extends string>(
  csv?: string | null | undefined,
  options?: {
  /** @default ',' */
    delimiter?: string
    /** @default true */
    trimValues?: boolean
  }
): CSVRow<Header>[]
```

**Example:**

```ts
const csv = `name,age
John,30
Jane,25`

const data = parseCSV<'name' | 'age'>(csv) // [{ name: 'John', age: '30' }, { name: 'Jane', age: '25' }]
```

### Emitter

Simple and tiny event emitter library for JavaScript.

`createEmitter` accepts interface with event name to listener argument types mapping:

```ts
import { createEmitter } from 'utilful'

interface Events {
  set: (name: string, count: number) => void
  tick: () => void
}

const emitter = createEmitter<Events>()

// Correct calls:
emitter.emit('set', 'prop', 1)
emitter.emit('tick')

// Compilation errors:
emitter.emit('set', 'prop', '1')
emitter.emit('tick', 2)
```

The `on` method returns an `unbind` function. Call it and this listener will be removed from event:

```ts
const unbind = emitter.on('tick', (number) => {
  console.log(`on ${number}`)
})

emitter.emit('tick', 1)
// Prints "on 1"

unbind()
emitter.emit('tick', 2)
// Prints nothing
```

You can get the used events list by accessing the `events` property:

```ts
const unbind = emitter.on('tick', () => { })
emitter.events // => { tick: [ [Function] ] }
```

### JSON

#### `tryParseJSON`

Type-safe wrapper around `JSON.stringify`.

Falls back to the original value if the JSON serialization fails or the value is not a string.

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

### Lazy

A simple general purpose memoizer utility.

- Lazily computes a value when accessed
- Auto-caches the result by overwriting the getter
- Typesafe

Useful for deferring initialization or expensive operations. Unlike a simple getter, there is no runtime overhead after the first invokation, since the getter itself is overwritten with the memoized value.

```ts
declare function lazy<T>(getter: () => T): { value: T }
```

**Example:**

```ts
const myValue = lazy(() => 'Hello, World!')
console.log(myValue.value) // Computes value, overwrites getter
console.log(myValue.value) // Returns cached value
console.log(myValue.value) // Returns cached value
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
import { interopDefault } from 'utilful'

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

Joins the given URL path segments, ensuring that there is only one slash between them.

```ts
declare function joinURL(...paths: (string | undefined)[]): string
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
import { withQuery } from 'utilful'

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
declare function template(
  str: string,
  variables: Record<string | number, any>,
  fallback?: string | ((key: string) => string)
): string
```

**Example:**

```ts
import { template } from 'utilful'

const str = 'Hello, {name}!'
const variables = { name: 'world' }

console.log(template(str, variables)) // Hello, world!
```

#### `generateRandomId`

Generates a random string. The function is ported from [`nanoid`](https://github.com/ai/nanoid). You can specify the size of the string and the dictionary of characters to use.

```ts
declare function generateRandomId(size?: number, dict?: string): string
```

## License

[MIT](./LICENSE) License © 2024-PRESENT [Johann Schopplich](https://github.com/johannschopplich)
