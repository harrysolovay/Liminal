# Fragments

```ts twoslash include animal
import { T } from "structured-outputs"

const Dog = T.object({
  toy: T.enum("Bone", "Shoe", "Homework"),
})

const Cow = T.object({
  a5: T.boolean,
})

const Animal = T.taggedUnion("type", {
  Dog,
  Cow,
})
```

```ts twoslash include assert
declare function assert(expr: unknown, msg?: string): void
declare function assertEquals(actual: unknown, expected: unknown, msg?: string): void
```

```ts twoslash include openai
import Openai from "openai"
declare const openai: Openai
```
