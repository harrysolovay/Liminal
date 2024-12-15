# `Derived`

`Derived` is a utility type for amalgamating multiple `Type`s. This is useful for explicitly-typing
functions that accept and return types (somewhat of a requirement for [JSR](http://jsr.io).[^1]

## Signature

`Derived` has the following signature.

```ts
export type Derived<
  T,
  X extends Array<AnyType>,
  P extends keyof any = never,
>
```

### `T`

Corresponds to the native TypeScript type.

### `X`

A list of all types from which the new derived type is composed.

### `P`

## Example

```ts twoslash
import { AnyType, Derived } from "liminal"
// ---cut---

function LeastLikely<X extends AnyType>(ty: X): Derived<X["T"], [X]> {
  return ty`Ensure that this value is the least likely version of itself.`
}
```

[^1]: [slow types documentation](https://jsr.io/docs/about-slow-types)
