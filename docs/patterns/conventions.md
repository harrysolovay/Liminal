---
prev:
  text: Authoring Patterns
  link: patterns/authoring
next:
  text: Custom Types
  link: patterns/custom-types
---

# Conventions

## Exposing Parameter Keys

If you are publishing a pattern library of parameterized types, you may want to specify parameter
keys as symbols, which you export from your library's entrypoint.

```ts twoslash
import { T } from "structured-outputs"
// ---cut---
export namespace P {
  export const grade = Symbol()
}

export const SchoolCurriculumSubject = T.string`The school curriculum for grade ${P.grade}.`
```

> Note: a pattern library may include many parameter keys. To simplify end-developer usage, we place
> all keys under a single library-wide `P` namespace.

## Accounting For JSR Slow Types

JSR is a TypeScript package registry created by the Deno team. In the case that you wish to publish
your pattern library to JSR, be weary of [slow types](https://jsr.io/docs/about-slow-types).

In the previous code block––for example––we would need to add an explicit type to avoid static
analysis degradation.

```ts twoslash
import { T, Type } from "structured-outputs"

export namespace P {
  export const grade = Symbol()
}
// ---cut---
const SchoolCurriculumSubject: Type<
  string,
  {},
  typeof P.grade
> = T.string`The school curriculum for grade ${P.grade}.`
```

If we are creating a functional pattern, we explicitly return or unwrap type arguments.

In the following example, the return type is simply the sole parameter type.

```ts twoslash
import { Refinements, T, Type } from "structured-outputs"
// ---cut---
export function MostUnlikely<T, R extends Refinements, P extends keyof any>(
  ty: Type<T, R, P>,
): Type<T, R, P> {
  return ty`Ensure that this generated type is the most unlikely instance of itself.`
}
```

However, we may encounter cases which require us to unwrap the `Ty` type parameter(s) and explicitly
form a return `Ty` type.

```ts twoslash
import { Refinements, T, Type } from "structured-outputs"
// ---cut---
export namespace P {
  export const Tone = Symbol()
}

export function WithTone<T, R extends Refinements, P extends keyof any>(
  ty: Type<T, R, P>,
): Type<T, R, P | typeof P.Tone> {
  return ty`Generate with a tone of ${P.Tone}.`
}
```
