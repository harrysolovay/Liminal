---
prev:
  text: Patterns Overview
  link: patterns
next: false
---

# Authoring Patterns

## Functional Patterns

Functional patterns are simply functions that return `Ty`s.

### Basic Example

For example, we can create a `Range` pattern, which attaches important context to a `number`.

```ts twoslash
import { T } from "structured-outputs"
// ---cut---
function Range(from: number, to: number) {
  return T.number`A number between ${"from"} and ${"to"}`.fill({ from, to })
}
```

### `Ty`s as Arguments

In some cases, you may want to accept `Ty`s as arguments, which inform the type of the returned
`Ty`.

```ts twoslash
import { T } from "structured-outputs"
// ---cut---

function MostUnlikely<X extends T.Ty>(ty: X) {
  return ty`Ensure that this generated type is the most unlikely instance of itself.`
}
```

## Standard Patterns

### `Option`

```ts twoslash
import { T } from "structured-outputs"
// ---cut---
const Critique = T.Option(T.string)

Critique
// ^?
```

<br />
<br />
<br />
<br />
<br />
<br />
<br />

### `Date`

```ts twoslash
import { T } from "structured-outputs"
// ---cut---
T.Date
```

## Library Placeholder Convention

If you are publishing a pattern library of placeholder-bearing types, you may want to specify
placeholder keys as symbols, which you export from your library's entrypoint.

```ts twoslash
import { T } from "structured-outputs"
// ---cut---
export namespace P {
  export const grade = Symbol()
}

export const SchoolCurriculumSubject = T.string`The school curriculum for grade ${P.grade}.`
```

> Note: a pattern library may include many placeholder keys. To simplify end-developer usage, we
> place all keys under a single library-wide `P` namespace.

## JSR Slow Types

JSR is a TypeScript package registry created by the Deno team. In the case that you wish to publish
your pattern library to JSR, be weary of [slow types](https://jsr.io/docs/about-slow-types).

In the previous code block––for example––we would need to add an explicit type to avoid static
analysis degradation.

```ts twoslash
import { T } from "structured-outputs"

export namespace P {
  export const grade = Symbol()
}
// ---cut---
const SchoolCurriculumSubject: T.Ty<string, typeof P.grade, false> = T
  .string`The school curriculum for grade ${P.grade}.`
```

If we are creating a functional pattern, we explicitly return or unwrap type arguments.

In the following example, the return type is simply the sole parameter type.

```ts twoslash
import { T } from "structured-outputs"
// ---cut---
export function MostUnlikely<T, P extends keyof any, R extends boolean>(
  ty: T.Ty<T, P, R>,
): T.Ty<T, P, R> {
  return ty`Ensure that this generated type is the most unlikely instance of itself.`
}
```

However, we may encounter cases which require us to unwrap the `Ty` type parameter(s) and explicitly
form a return `Ty` type.

```ts twoslash
import { T } from "structured-outputs"
// ---cut---
export namespace P {
  export const Tone = Symbol()
}

export function WithTone<T, P extends keyof any, R extends boolean>(
  ty: T.Ty<T, P, R>,
): T.Ty<T, P | typeof P.Tone> {
  return ty`Generate with a tone of ${P.Tone}.`
}
```

## Custom Types

In the case that you need to implement a custom type, this may indicate a current shortcoming of
`structured-outputs` and you're encouraged to
[file an issue](https://github.com/harrysolovay/structured-outputs/issues/new). That being said,
here's how you can create a custom type.

Let's create an `any` type (not intended to be used in production).

```ts twoslash
import { T } from "structured-outputs"
// ---cut---
const any: T.Ty<any, never, false> = T.Ty(
  () => ({
    type: "object",
    properties: {},
  }),
  false,
)
```

You could similarly create a functional pattern, which accepts arguments and uses them to form the
returned `Ty`.
