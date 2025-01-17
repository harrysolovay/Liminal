# Troubleshooting

TODO: root-wrapping

## Unfilled Parameters

At the time of `ResponseFormat` creation, arguments must be applied to all parameters of the root
type.

Therefore, an error is produced if you try to create a `ResponseFormat` with an unapplied type.

```ts
// @errors: 2345
import { ResponseFormat, T } from "liminal"
// ---cut---
const Root = T.object({
  value: T.string`Arg: ${"param_key"}.`,
})

ResponseFormat("my_format", Root)
```

To solve this error, fill in the missing parameter.

```ts
import { ResponseFormat, T } from "liminal"

const Root = T.object({
  value: T.string`Arg: ${"param_key"}.`,
})
// ---cut---
ResponseFormat("my_format", Root.of({ param_key: "missing context" }))
```

## Context Parameter Keys

Context parameter keys are tracked within the type system to ensure all have been applied at the
time of `ResponseFormat` creation. Widening of the union type of all parameter keys would break this
type-level assurance. Therefore, widened key types are disallowed; it is not possible to
parameterize context with a widened `number`, `string` or `symbol`.

```ts
// @errors: 2345
import { T } from "liminal"
// ---cut---
declare const param_key: string

const MyType = T.string`Arg: ${param_key}`
```

If you see this error, it may indicate that you are trying to interpolate some raw context text
rather than parameterize the context. In cases such as this, utilize a short-lived parameter
instead.

```ts
import { T } from "liminal"
// ---cut---
const MyType = T
  .string`Some text we want to interpolate: ${"_"}.`
  .of({ _: "the text" })
```
