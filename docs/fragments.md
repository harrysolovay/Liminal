<div style="display: none">

```ts twoslash include L
import { L } from "liminal"
```

```ts twoslash include animal
// @include: L

const Dog = L.object({
  toy: L.enum("Bone", "Shoe", "Homework"),
})

const Cow = L.object({
  a5: L.boolean,
})

const Animal = L.TaggedUnion({
  Dog,
  Cow,
})
```

```ts twoslash include assert
declare function assert(expr: unknown, msg?: string): void
declare function assertEquals(actual: unknown, expected: unknown, msg?: string): void
```

```ts twoslash include rf
import { OpenAIResponseFormat } from "liminal"
```

```ts twoslash include openai
import Openai from "openai"
declare const openai: Openai
```

</div>
