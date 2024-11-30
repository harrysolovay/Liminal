---
prev:
  text: Context
  link: context
next: false
---

# Common Errors

<!-- ## Root Types Must Be Object Types

OpenAI only supports objects as root types
([see the official documentation](https://platform.openai.com/docs/guides/structured-outputs#root-objects-must-not-be-anyof)).
Because of this constraint, each `Ty` is encoded with whether it can be used as a root type.

Therefore, an error is produced if you try to specify a non-root type as the `ResponseFormat` or
`Tool` root type.

```ts twoslash
// @errors: 2345
import { ResponseFormat, T } from "structured-outputs"
// ---cut---
const response_format = ResponseFormat("my_format", T.string)
``` -->

## Unfilled Parameters

At the time of `ResponseFormat` creation, arguments must be applied to all parameters of the root
type.

Therefore, an error is produced if you try to create a `ResponseFormat` with an unapplied type.

```ts twoslash
// @errors: 2345
import { ResponseFormat, T } from "structured-outputs"
// ---cut---
const Root = T.object({
  value: T.string`Arg: ${"param_key"}.`,
})

ResponseFormat("my_format", Root)
```

To solve this error, fill in the missing parameter.

```ts twoslash
import { ResponseFormat, T } from "structured-outputs"

const Root = T.object({
  value: T.string`Arg: ${"param_key"}.`,
})
// ---cut---
ResponseFormat("my_format", Root.fill({ param_key: "missing context" }))
```

## Context Parameter Keys

Context parameter keys are tracked within the type system to ensure all have been applied at the
time of `ResponseFormat` creation. Widening of the union type of all parameter keys would break this
type-level assurance. Therefore, widened key types are disallowed; it is not possible to
parameterize context with a widened `number`, `string` or `symbol`.

```ts twoslash
// @errors: 2345
import { T } from "structured-outputs"
// ---cut---
declare const param_key: string

const MyType = T.string`Arg: ${param_key}`
```

If you see this error, it may indicate that you are trying to interpolate some raw context text
rather than parameterize the context. In cases such as this, utilize a short-lived parameter
instead.

```ts twoslash
import { T } from "structured-outputs"
// ---cut---
const MyType = T
  .string`Some text we want to interpolate: ${"_"}.`
  .fill({ _: "the text" })
```
