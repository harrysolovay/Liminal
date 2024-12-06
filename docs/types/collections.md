# Collections

## `T.array`

```ts twoslash
import { T } from "structured-outputs"
// ---cut---
const Mantras = T.array(T.string`A yogi mantra.`)

Mantras
// ^?
```

<br />

## `T.object`

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

## `T.Tuple`

```ts twoslash
import { T } from "structured-outputs"
// ---cut---
const Coords = T.Tuple(
  T.number`Latitude`,
  T.number`Longitude`,
)

Coords
// ^?
```

<br />

> Under the hood, `T.Tuple` utilizes `T.object` with sequential numeric keys and then `T.transform`s
> the resulting structured output into an array.

## `T.Record`

```ts twoslash
import { T } from "structured-outputs"
// ---cut---
const CustomerIdLookup = T.Record(T.number)

CustomerIdLookup
// ^?
```

<br />

> Under the hood, `T.Record` utilizes a `T.array` of `T.tuple`s--describing the record's
> entries––which are then `T.transform`ed into a JavaScript object.
