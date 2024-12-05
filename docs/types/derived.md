# Derived Types

## `T.Derived`

## Explicit Signatures

For JSR

## Generic Functions

## Atomic Patterns

A pattern can be as simple as attaching some context to a type.

```ts twoslash
import { T } from "structured-outputs"
// ---cut---
export const Song = T.string`Ensure this text is a 16-bars song.`
```

## Parameterized Context

Patterns can contain unfilled/parameterized context.

```ts twoslash
import { T } from "structured-outputs"
// ---cut---
export const Song = T.string`Ensure this text is a 16-bars song in the style of ${"song_style"}.`
```

## Functional Patterns

Functional patterns are simply functions that return types.

### Basic Example

For example, we can create a `Range` pattern, which attaches important context to a `number`.

```ts twoslash
import { T } from "structured-outputs"
// ---cut---
export function Range(from: number, to: number) {
  return T.number`A number between ${"from"} and ${"to"}`.fill({ from, to })
}
```

### Types as Arguments

You may want to accept types as arguments, which inform the type of the return.

```ts twoslash
import { Type } from "structured-outputs"
// ---cut---

function MostUnlikely<X extends Type>(ty: X) {
  return ty`Ensure that this generated type is the most unlikely version of itself.`
}
```
