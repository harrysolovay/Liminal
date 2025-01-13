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

## `T.taggedUnion`

```ts
import { T } from "liminal"
// ---cut---
const Organism = T.taggedUnion("type", {
  Dog: T.object({
    bark: T.string,
  }),
  Cat: T.object({
    meow: T.string,
  }),
  Bacteria: undefined,
})

Organism
// ^?
```

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
