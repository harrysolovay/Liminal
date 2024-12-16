# Descriptions

## Chaining

## Parameterization

The descriptions contained within your types serve as context for the LLM. It is for this reason
that the core unit of `liminal`––`Ty`--is an infinitely-chainable tagged template function.

```ts twoslash
import { L } from "liminal"
// ---cut---
const A = L.string`A.`
const B = A`B.`
const C = B`C.`
```

The resulting description contained within the JSON Schema will contain the concatenated
descriptions.

```json
{
  "type": "string",
  "description": "C. B. A."
}
```

This enables us to attach additional context to any type.

Descriptions in schema definitions serve as additional context for the LLM. We may want to attach
context per-type.

```ts twoslash
import { L } from "liminal"
// ---cut---
const Contact = L.object({
  name: L.string`
    Ensure normal length for a person's full name.
  `,
  phone: L.number`
    Ensure the format is that of a phone number.
  `,
  email: L.string`
    Ensure the format is that of an email address.
  `,
})`
  A collection of information common in contact cards.
`
```

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
