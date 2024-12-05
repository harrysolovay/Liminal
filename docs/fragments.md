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

```ts twoslash include import-T
// - 1
import { T } from "structured-outputs"
```

```ts twoslash include assert
declare function assert(expr: unknown, msg?: string): asserts expr
```

```ts twoslash include openai
import Openai from "openai"
declare const openai: Openai
```
