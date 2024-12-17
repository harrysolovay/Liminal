# Unions

<br />

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
<br />
