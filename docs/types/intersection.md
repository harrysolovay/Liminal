# `L.Intersection`

```ts twoslash
import { L } from "liminal"
// ---cut---
const First = L.object({
  a: L.boolean,
  b: L.number,
})

const Second = L.object({
  c: L.integer,
  d: L.string,
})

const Intersection = L.Intersection(First, Second)

Intersection
// ^?
```

<br />
<br />
<br />
<br />
<br />
<br />
