---
prev:
  text: Pattern Conventions
  link: patterns/conventions
next: false
---

# Custom Types

TODO

<!-- In the case that you need to implement a custom type, this may indicate a current shortcoming of
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

The arguments passed to `T.Ty` are as follows:

- A function that returns the type's JSON Schema. The `description` will be injected into the
  returned object.
- Whether the type can be used as a root type.

You could similarly create a functional pattern, which accepts arguments and uses them to form the
returned `Ty`. -->
