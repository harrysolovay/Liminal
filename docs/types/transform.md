# `T.transform`

We may often want to transform the data returned by the OpenAI service into a different type. In
these situations, we can utilize the `transform` type.

TODO: this mechanism underlays misc. types

TODO: notes about serialization

For example, we may query OpenAI for an RGB color object, which we then transform into a hex string.

```ts twoslash
import { T } from "structured-outputs"
// ---cut---
declare function assertMin(value: number, min: number): void
declare function assertMax(value: number, max: number): void

const Channel = T.number.assert(assertMin, 1).assert(assertMax, 255)

const Rgb = T.Tuple(Channel, Channel, Channel)

const ColorHex = T.transform(
  "ColorHex",
  Rgb,
  (channels) => channels.map((c) => c.toString(16).padStart(2, "0")).join(""),
)

ColorHex
// ^?
```

## Computed Fields
