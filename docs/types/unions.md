# Unions

## `T.enum`

```ts twoslash
import { T } from "structured-outputs"
// ---cut---
const Mood = T.enum("Elated", "Devastated", "Fine")

Mood
// ^?
```

<br />

## `T.taggedUnion`

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

### `T.Union`

If all members of your union are object-value-bearing, `T.taggedUnion` is preferred.

> `T.Union` denotes it is not a core type, but rather derived from `T.taggedUnion`, which ensures
> that we have a discriminant with which to select the member type corresponding to structured
> output values.
