# Parameterize Context

TODO: add note about intended use (not dynamic / OpenAI needs to generate a CFG).

Often times, we may want to reuse the structure of a type, but not the context. In these cases, we
can interpolate parameter keys into the template literal of the `Ty` tagged template expression.

```ts twoslash
import { T } from "liminal"
// ---cut---
const Character = T.object({
  name: T.string,
  behavior: T.string,
})`A ${"character_type"} character of a ${"story_type"} story.`
```

Whenever we wish to use this context-parameterized type, we can fill in the missing context.

```ts twoslash
import { T } from "liminal"

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

<!-- TODO: possibly uncomment/fix this once you hear back re.
https://github.com/shikijs/twoslash/issues/199.

Note that the parameter keys are represented within the type system so that we get completions from
the language server.

```ts twoslash
import { T } from "liminal"

const Character = T.object({
  name: T.string,
  behavior: T.string,
})`A ${"character_type"} character of a ${"story_type"} story.`
// ---cut---
const StoryCharacters = Character.of({
  // ^|
})
``` -->
