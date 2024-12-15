# Parameterize Context

TODO: add note about intended use (not dynamic / OpenAI needs to generate a CFG).

Often times, we may want to reuse the structure of a type, but not the context. In these cases, we
can interpolate parameter keys into the template literal of the `Ty` tagged template expression.

```ts twoslash
import { L } from "liminal"
// ---cut---
const Character = L.object({
  name: L.string,
  behavior: L.string,
})

// `A ${"character_type"} character of a ${"story_type"} story.`
```

Whenever we wish to use this context-parameterized type, we can fill in the missing context.

```ts
import { L } from "liminal"

const Character = T.object({
  name: T.string,
  behavior: T.string,
})`A ${"character_type"} character of a ${"story_type"} story.`
// ---cut---
const StoryCharacters = Character.of({
  character_type: "virtuous",
  story_type: "romance",
})
```

We can parameterize context with any valid JavaScript key subtype (`number` | `string` | `symbol`).
