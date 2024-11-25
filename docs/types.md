---
prev:
  text: Getting Started
  link: getting-started
next:
  text: Context
  link: context
---

# Types

Runtime representations of types can be accessed off of `T`, exported from the entry point of
`structured-outputs`.

```ts twoslash
import { T } from "structured-outputs"
```

## Primitive Types

```ts twoslash
import { T } from "structured-outputs"
// ---cut---
T.boolean
T.number
T.string
```

## Composite Types

array object literalUnion taggedUnion

## Standard Pattern Types

option wrapper date
