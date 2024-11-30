---
prev:
  text: Quickstart
  link: quickstart
next:
  text: Context
  link: context
---

# Types

Runtime representations of types (`Type`s) can be accessed on `T`, which is exported from the entry
point of `structured-outputs`.

```ts twoslash
import { T } from "structured-outputs"
```

Every `Type` has three type parameters:

- `T`: The native TypeScript type to which the response data decodes.
- `R extends Record<string, unknown>`: The refinements that can be applied to the given type.
- `P extends keyof any`: The literal types of context parameter keys (more on this
  [in the context section](./context.md)).

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
<br />
<br />
<br />
<br />
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

## Union Types

### Constant Unions

```ts twoslash
import { T } from "structured-outputs"
// ---cut---
const Mood = T.enum("Elated", "Devastated", "Fine")

Mood
// ^?
```

<br />

### Tagged Unions

```ts twoslash
import { T } from "structured-outputs"
// ---cut---
const Organism = T.taggedUnion("type", {
  Dog: T.object({
    bark: T.string,
  }),
  Cat: T.object({
    meow: T.string,
  }),
  Bacteria: null,
})

Organism
// ^?
```

<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />

### Any Union

```ts twoslash
import { T } from "structured-outputs"
// ---cut---
const Mood = T.union(
  T.string,
  T.number,
  T.object({
    x: T.boolean,
  }),
)

Mood
// ^?
```

<br />
<br />
<br />

## Transform Types

We may often want to transform the data returned by the OpenAI service into a different type. In
these situations, we can utilize the `transform` type.

For example, we may query OpenAI for an RGB color object, which we then transform into a hex string.

```ts twoslash
import { T } from "structured-outputs"
// ---cut---
const Channel = T.number.refine({
  min: 0,
  max: 255,
})

const Rgb = T.tuple(Channel)

const ColorHex = T.transform(
  "ColorHex",
  Rgb,
  (channels) => channels.map((c) => c.toString(16).padStart(2, "0")).join(""),
)

ColorHex
// ^?
```
