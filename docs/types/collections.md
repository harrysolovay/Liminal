# Collections

## `L.array`

```ts twoslash
import { L } from "liminal"
// ---cut---
const Mantras = L.array(L.string`A yogi mantra.`)

Mantras
// ^?
```

<br />

## `L.object`

```ts twoslash
import { L } from "liminal"
// ---cut---
const DrinkSuggestion = L.object({
  includeLemonZest: L.boolean,
  alcoholType: L.string`A type of alcohol.`,
  mysterySpice: L.string`A spice that tastes good in an alcoholic beverage.`,
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
import { L } from "liminal"
// ---cut---
const Coords = L.Tuple(
  L.number`Latitude`,
  L.number`Longitude`,
)

Coords
// ^?
```

<br />

> Under the hood, `T.Tuple` utilizes `T.object` with sequential numeric keys and then `T.transform`s
> the resulting structured output into an array.

## `T.Record`

```ts twoslash
import { L } from "liminal"
// ---cut---
const CustomerIdLookup = L.Record(L.number)

CustomerIdLookup
// ^?
```

<br />

> Under the hood, `T.Record` utilizes a `T.array` of `T.tuple`s--describing the record's
> entries––which are then `T.transform`ed into a JavaScript object.
