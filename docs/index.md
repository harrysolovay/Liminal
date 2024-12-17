---
title: Overview
---

<!--@include: ./fragments.md-->

# Liminal <Badge type="warning" text="beta" />

Liminal is a library for modeling types for and with LLMs.

The initial aim is to simplify declaring and refining structured outputs. A possible aim of Liminal
is to enable LLMs to take part in the declaration and evolution of type contexts, from which values
can be generated and better-understood. The unit of composition in Liminal is a
[`Type`](./types/index.md), which can be used with any model that support JSON-schema-based
tool-calling (such as [gpt-4o](https://openai.com/index/hello-gpt-4o/),
[claude 3.5 Sonnet](https://www.anthropic.com/news/claude-3-5-sonnet),
[Llama 3.3](https://www.llama.com/docs/model-cards-and-prompt-formats/llama3_3/) and
[Grok 2 Beta](https://x.ai/blog/grok-2)).

## [Model Types and Generate Values](./types/index.md)

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

> Note: must configure `tsconfig` such that module resolution mode supports package export subpaths
> (such as `Node16` or `NodeNext`).

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
