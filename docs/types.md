---
prev:
  text: Quickstart
  link: quickstart
next:
  text: Context
  link: context
---

# Types

Runtime representations of types (`Ty`s) can be accessed on `T`, which is exported from the entry
point of `structured-outputs`.

```ts twoslash
import { T } from "structured-outputs"
```

For example, the initial string `Ty` looks as follows.

```ts twoslash
import { T } from "structured-outputs"
// ---cut---
T.string
// ^?
```

<br />

Every `Ty` has three type parameters:

- `T`: The native TypeScript type to which the response data decodes.
- `P extends keyof any`: The literal types of context parameter keys (more on this
  [in the context section](./context.md)).
- `R extends boolean`: Whether the type can be used as the `ResponseFormat` or `Tool` root type.

## Primitive Types

### `boolean`s

```ts twoslash
import { T } from "structured-outputs"
// ---cut---
T.boolean
```

### `number`s

```ts twoslash
import { T } from "structured-outputs"
// ---cut---
T.number
```

### `string`s

```ts twoslash
import { T } from "structured-outputs"
// ---cut---
T.string
```

## Composite Types

### `tuple`s

```ts twoslash
import { T } from "structured-outputs"
// ---cut---
const Coords = T.tuple(
  T.number`Latitude`,
  T.number`Longitude`,
)

Coords
// ^?
```

<br />

### `array`s

```ts twoslash
import { T } from "structured-outputs"
// ---cut---
const Mantras = T.array(T.string`A yogi mantra.`)

Mantras
// ^?
```

<br />

### `object`s

```ts twoslash
import { T } from "structured-outputs"
// ---cut---
const DrinkSuggestion = T.object({
  includeLemonZest: T.boolean,
  alcoholType: T.string`A type of alcohol.`,
  mysterySpice: T.string`A spice that tastes good in an alcoholic beverage.`,
})

DrinkSuggestion
// ^?
```

<br />
<br />
<br />
<br />
<br />
<br />

## Union Types

### Constant Unions

```ts twoslash
import { T } from "structured-outputs"
// ---cut---
const Mood = T.constantUnion(
  "Elated",
  "Devastated",
  "Fine",
)

Mood
// ^?
```

<br />

### Tagged Unions

```ts twoslash
import { T } from "structured-outputs"
// ---cut---
const Organism = T.taggedUnion({
  Dog: T.object({
    bark: T.string,
  }),
  Cat: T.object({
    meow: T.string,
  }),
  Bacteria: null,
})

Organism
// TODO: reenable ^? after union flattening
```

## Transform Types

We may often want to transform the data returned by the OpenAI service into a different type. In
these situations, we can utilize the `transform` type.

For example, we may query OpenAI for an RGB color object, which we then transform into a hex string.

```ts twoslash
import { T } from "structured-outputs"
// ---cut---
export const Hex = T.transform(
  T.object({
    r: T.number`Between 0 and 255`,
    g: T.number`Between 0 and 255`,
    b: T.number`Between 0 and 255`,
  }),
  ({ r, g, b }) => `${toHex(r)}${toHex(g)}${toHex(b)}"`,
)

function toHex(value: number): string {
  return value.toString(16).padStart(2, "0")
}

Hex
// ^?
```
