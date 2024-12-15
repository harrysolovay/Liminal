# `T.Intersection`

```ts twoslash
import { T } from "liminal"
// ---cut---
const First = T.object({
  a: T.boolean,
  b: T.number,
})

const Second = T.object({
  c: T.integer,
  d: T.string,
})

const Intersected = T.Intersect(First, Second)

Intersected
// ^?
```

<br />
<br />
<br />
<br />
<br />
<br />
