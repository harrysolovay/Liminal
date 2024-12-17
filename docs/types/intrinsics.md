# Intrinsic Types

## Primitives

### `L.boolean`

```ts twoslash
import { L } from "liminal"
// ---cut---
L.boolean
// ^?
```

<br />

### `L.integer`

```ts twoslash
import { L } from "liminal"
// ---cut---
L.integer
// ^?
```

<br />

### `L.number`

```ts twoslash
import { L } from "liminal"
// ---cut---
L.number
// ^?
```

<br />

### `L.string`

```ts twoslash
import { L } from "liminal"
// ---cut---
L.string
// ^?
```

<br />

## Collections

### `L.array`

```ts twoslash
import { L } from "liminal"
// ---cut---
const Mantras = L.array(L.string`A yogi mantra.`)

Mantras
// ^?
```

<br />

### `L.object`

```ts twoslash
import { L } from "liminal"
// ---cut---
const Drink = L.object({
  base: L.string`The base of a drink.`,
  spice: L.string`A spice that tastes good in a beverage.`,
})

Drink
// ^?
```

<br />
<br />
<br />
<br />
<br />

## Unions

### `T.enum`

```ts twoslash
import { L } from "liminal"
// ---cut---
const Mood = L.enum("Elated", "Devastated", "Fine")

Mood
// ^?
```

<br />

### `T.union`

```ts twoslash
import { L } from "liminal"
// ---cut---
const Key = L.union(L.string, L.number)

Key
// ^?
```

<br />
