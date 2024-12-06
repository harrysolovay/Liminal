<!--@include: ../fragments.md-->

# MetaType

`MetaType` is a `Type<Type<unknown, never>>`.

It enables us to ask completions for new structured output schemas. We can use these subsequent
schemas for subsequent completions. The aim of `MetaType` is to enable the LLM to tell you what
structured output to ask for.

```ts twoslash
// @include: openai
// @include: T
// @include: rf
// ---cut---
const response_format = ResponseFormat("story_world_schema", T.MetaType)`
  Type definition of an object that contains information about a fictional story world.
`

const StoryWorld = await openai.chat.completions
  .create({
    model: "gpt-4o-mini",
    messages: [{ role: "system", content: [] }],
    response_format,
  })
  .then(response_format.into)

StoryWorld
// ^?
```

<br />

If we inspect this type, we may see something like the following.

<!-- cspell:disable -->

```ts
T.object({
  name: T.string,
  dimensions: T.array(T.string),
  dominant_species: T.array(T.string),
  magic_system: T.object({ types_of_magic: T.array(T.string), magic_sources: T.string }),
  technology_level: T.string,
  mythology: T.object({ gods: T.array(T.string), legends: T.array(T.string) }),
  conflicts: T.array(T.string),
})
```

<!-- cspell:enable -->

Let's send a subsequent completion requests using this dynamic type as the response format schema.

```ts twoslash
// @include: openai
import { ResponseFormat, Type } from "structured-outputs"
declare const StoryWorld: Type<unknown, never>
// ---cut---

const dynResponseFormat = ResponseFormat("story_world", StoryWorld)

const world = await openai.chat.completions
  .create({
    model: "gpt-4o-mini",
    messages: [{ role: "system", content: [] }],
    response_format: dynResponseFormat,
  })
  .then(dynResponseFormat.into)
```

Let's now inspect `world`.

```json
{
  "name": "Aetheria",
  "dimensions": ["Eldoria", "Techna", "Mystara", "Altheris"],
  "dominant_species": ["Humans", "Elves", "Dwarves", "Androids"],
  "magic_system": {
    "types_of_magic": ["Elemental", "Necromancy", "Alchemy", "Illusion"],
    "magic_sources": "Ley lines and ancient artifacts scattered across the world."
  },
  "technology_level": "Steam-powered machines and holographic interfaces coexist harmoniously with mystical spells and arcane knowledge.",
  "mythology": {
    "gods": ["Tharos the Wise", "Zyra the Tempest", "Elenor the Dreamweaver"],
    "legends": ["The Tale of the Chosen One", "The Founding of Techna", "The Great Cataclysm"]
  },
  "conflicts": [
    "The War of the Realms: A brutal struggle between Eldoria and Techna for control of the ancient ley lines.",
    "The Great Rebellion: A clash between the ruling Dwarven caste and the Androids seeking freedom from oppression."
  ]
}
```
