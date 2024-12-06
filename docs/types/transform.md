# `T.transform`

We can abstract over transformations of underlying structured output. This allows us reason about
preprocessed values instead of their raw counterpart.

Let's say we want to generate colors. The raw schema may look as follows.

<div style="display: none">

```ts twoslash include color-rgb
import { T } from "structured-outputs"
// ---cut---
const ColorChannel = T.number`Ranging from 1 to 255.`
const ColorRgb = T.Tuple(
  ColorChannel,
  ColorChannel,
  ColorChannel,
)
// - 1
```

</div>

```ts twoslash
// @include: color-rgb

ColorRgb
// ^?
```

<br />

However, we may prefer to deal with generated colors in hexadecimal string form. We can achieve this
with `T.transform`.

```ts twoslash
// @include: color-rgb
// ---cut---
const ColorHex = T.transform(
  "ColorHex",
  ColorRgb,
  (channels) => channels.map((c) => c.toString(16).padStart(2, "0")).join(""),
)

ColorHex
// ^?
```

<br />

> Note: `T.transform` types specify JavaScript functions, and therefore cannot be safely serialized
> into a predictable format. Therefore, they cannot be serialized into `TypeInfo`.
