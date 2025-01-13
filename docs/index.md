---
title: Overview
---

# Liminal <Badge type="warning" text="beta" />

Liminal is a TypeScript library for integrating with LLMs. It provides a clean way to manage
conversations through an immutable message system, where each message is a self-contained unit that
can include text, structured data, or media. This approach makes it easy to track conversation
history, branch conversations, and maintain state without side effects. You can build anything from
simple one-off queries to complex multi-turn conversations with structured outputs. Liminal works
with models that support JSON-schema-based function calling, including leading models like GPT-4,
Claude 3, and others.

## Stateful Conversations

Model complex dialogue flows with built-in support for branching logic, state management, and
contextual memory.

## [Model Types and Generate Values](./types/index.md)

Use Liminal types as structured output schemas. Static types are inferred.

```ts
import { L, OpenAIAdapter } from "liminal"

const $ = L(OpenAIAdapter({
  openai: new OpenAI(),
}))

const Coordinates = L.Tuple(
  L.number`Latitude`,
  L.number`Longitude`,
)

const [
  latitude,
  longitude,
] = await $`Somewhere futuristic.`(Coordinates)
```

## [Annotate Types](./annotations/index.md)

Compose types with annotations––such as [descriptions](./annotations/descriptions.md),
[assertions](./annotations/assertions.md) and [pins](./annotations/pins.md)––which serve as
additional context to improve the quality of outputs.

```ts
const RGBColorChannel = L.number(
  min(0),
  max(255),
)`A channel of an RGB color triple.`
```

## [Iterative Refinement](./concepts/iterative-refinement.md)

Assertion annotations can contain runtime assertion functions. Upon receiving structured outputs,
clients can run these assertion functions and collect exceptions into diagnostic lists, to be sent
along with followup requests for corrections. This process can loop until all assertions pass,
iteratively piecing in valid data.

```ts
import { L, Liminal } from "liminal"
import { refine } from "liminal/openai"

const T = L.object({
  a: L.string,
  b: L.string,
})(L.assert(({ a, b }) => a.length > b.length, "`a` must be longer than `b`."))

const refined = await refine(openai, T, {
  max: 4,
})
```

> Here we specify a maximum of 4 iterations.

## [Transform Types](./types/transform.md)

Abstract over complex intermediate states.

```ts
const HexColor = L.transform(
  L.Tuple(RGBColorChannel, RGBColorChannel, RGBColorChannel),
  (rgb) => {
    return rgb.map((channel) => channel.toString(16).padStart(2, "0")).join("")
  },
)
```

> We could use `L.Tuple.N(RGBColorChannel, 3)` for brevity.

## [Type Libraries](./libraries/index)

Share types for common use cases.

::: code-group

```ts [liminal-music]
export const SongTitle = L.string`Title of a song.`

export const HipHopSongTitle = Song`Genre is hip hop.`
```

```ts [main.ts]
import { HipHopSongTitle } from "liminal-music"

const title = await liminal.value(
  HipHopSongTitle`Subject: developer tools.`,
)
```

:::
