# Meta Types

`MetaType` enables us to generate types which can be used for subsequent structured output requests.
The aim of meta types is to enable use of models for defining and evolving type contexts.

```ts
import { L, MetaType } from "liminal"
// ---cut---
import { OpenAIResponseFormat } from "liminal/openai"

const World = await (() => {
  const response_format = OpenAIResponseFormat("world_type", MetaType)
  return openai.chat.completions
    .create({
      model: "gpt-4o-mini",
      messages: [{
        role: "system",
        content: ["Declare a type representing a fictional story world."],
      }],
      response_format,
    })
    .then(response_format.into)
})()

World
// ^?
```

If we inspect the `StoryWorld` type, we may see a type similar to the following.

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

Let's send a subsequent completion requests using this dynamic type as the response format schema.

```ts
// @include: openai
import { ResponseFormat, Type } from "liminal"
declare const StoryWorld: Type<unknown>
// ---cut---
const response_format = OpenAIResponseFormat("world", World)

const world = openai.chat.completions
  .create({
    model: "gpt-4o-mini",
    messages: [{
      role: "system",
      content: ["Generate data about a fictional story world."],
    }],
    response_format,
  })
  .then(response_format.into)
```

Let's now inspect `world`.

<!-- cspell:disable -->

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

<!-- cspell:enable -->
