---
title: Overview
---

<!--@include: ./fragments.md-->

# Liminal <Badge type="warning" text="beta" />

The near-term aim of Liminal is to simplify declaring and refining structured outputs. The
longer-term aim is to enable LLMs to declare and evolve type contexts, from which values can be
materialized and understood. The foundational unit of this stack is a `Type`, which can be used
across LLMs that support tool-calling (such as [gpt-4o](https://openai.com/index/hello-gpt-4o/),
[claude 3.5 Sonnet](https://www.anthropic.com/news/claude-3-5-sonnet),
[Llama 3.3](https://www.llama.com/docs/model-cards-and-prompt-formats/llama3_3/) and
[Grok 2 Beta](https://x.ai/blog/grok-2)).

## [Model and Materialize Types](./types/index.md)

Use Liminal types as structured output schemas. Static types are inferred.

```ts {6-9,19,21}
import { L } from "liminal"
import { OpenAIResponseFormat } from "liminal/openai"

const response_format = OpenAIResponseFormat(
  "coordinates",
  L.Tuple(
    L.number`Latitude`,
    L.number`Longitude`,
  ),
)

const [latitude, longitude] = await openai.chat.completions
  .create({
    model: "gpt-4o-mini",
    messages: [{
      role: "user",
      content: ["Somewhere futuristic."],
    }],
    response_format,
  })
  .then(response_format.deserialize)
```

## [Annotate Types](./annotations/index.md)

Compose types with descriptions and assertions, which serve as additional context to improve the
quality of outputs.

```ts
const RGBColorChannel = L.number`A channel of an RGB color triple.`(
  min(0),
  max(255),
)
```

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

## [Iterative Refinement](./concepts/iterative-refinement.md)

Annotate types with any runtime assertions. Upon receiving a structured output, these assertions can
be run; any exceptions can be serialized into followup requests for corrections. This process can
loop until all assertions pass, iteratively piecing in valid data.

```ts
const T = L.object({
  a: L.string,
  b: L.string,
})(L.assert(({ a, b }) => a.length > b.length, "`A` must be longer than `B`"))

const refined = await liminal.value(T, {
  refine: { max: 4 },
})
```

> Here we specify a maximum of 4 iterations.

## [Type Libraries](./types/libraries.md)

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
