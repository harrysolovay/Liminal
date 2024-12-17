# Utility Types

## `L.Option`

```ts twoslash
import { L } from "liminal"
// ---cut---
const Status = L.Option(L.string`Failure reason.`)
//    ^?
```

<br />

## `L.Tuple`

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

## `L.Record`

```ts twoslash
import { L } from "liminal"
// ---cut---
const CustomerIdLookup = L.Record(L.number)

CustomerIdLookup
// ^?
```

<br />

> Under the hood, `T.Record` utilizes a `T.array` of `T.Tuple`s--describing the record's
> entries––which are then `T.transform`ed into a JavaScript object.

## `L.Intersection`

```ts twoslash
import { L } from "liminal"
// ---cut---
const A = L.object({
  one: L.boolean,
  two: L.integer,
})

const B = L.object({
  three: L.number,
  four: L.string,
})

const AB = L.Intersection(A, B)
//    ^?
```

<br />
<br />
<br />
<br />
<br />
<br />
<br />

## `L.Flattened`

```ts twoslash
import { L } from "liminal"
// ---cut---
const ABC = L.Tuple(L.boolean, L.integer, L.number)

const Rest = L.array(L.string)

const AB = L.Flattened(ABC, Rest)
//    ^?
```

<br />

## `L.TaggedUnion`

```ts twoslash
import { L } from "liminal"
// ---cut---
const ABC = L.TaggedUnion({
  A: L.number,
  B: L.object({
    b: L.string,
  }),
  C: null,
})

ABC
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

## `L.Set`

```ts twoslash
import { L } from "liminal"
// ---cut---
const CharacterTraits = L.Set(L.string`Character trait.`)

CharacterTraits
// ^?
```

<br />
