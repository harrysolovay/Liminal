---
title: Overview
---

<!--@include: ./fragments.md-->

# Liminal <Badge type="warning" text="beta" />

Liminal is a TypeScript library for integrating with LLMs. It provides a clean way to manage
conversations through an immutable message system, where each message is a self-contained unit that
can include text, structured data, or media. This approach makes it easy to track conversation
history, branch conversations, and maintain state without side effects. You can build anything from
simple one-off queries to complex multi-turn conversations with structured outputs. Liminal works
with models that support JSON-schema-based function calling, including leading models like GPT-4,
Claude 3, and others.

## Type-Safe Outputs

Define precise schemas for LLM output using Liminal's expressive type system, getting full
TypeScript inference and runtime validation.

## Stateful Conversations

Model complex dialogue flows with built-in support for branching logic, state management, and
contextual memory.

## Composable Design

Build sophisticated interactions by combining simple types and annotations, making even complex LLM
applications maintainable and type-safe.

The following sections demonstrate how to leverage these capabilities in your applications.

## [Model Types and Generate Values](./types/index.md)

Use Liminal types as structured output schemas. Static types are inferred.

```ts
import { L } from "liminal"
import { model } from "liminal/openai"
import OpenAI from "openai"

const Coordinates = L.Tuple(
  L.number`Latitude`,
  L.number`Longitude`,
)

const coordinates = await L
  .thread(
    "Somewhere tropical.",
    Coordinates,
  )
  .run(model(new OpenAI(), "gpt-4o-mini"))
```

## [Annotate Types](./annotations/index.md)

Compose types with annotations––such as [descriptions](./annotations/descriptions.md) and
[pins](./annotations/pins.md)––which serve as additional context to improve the quality of outputs.

```ts
const RGBColorChannel = L.number(min(0), max(255))`A channel of an RGB color triple.`
```

## [Codec Types](./types/transform.md)

Abstract over complex intermediate states.

```ts
const HexColor = L.transform(
  L.Tuple(RGBColorChannel, RGBColorChannel, RGBColorChannel),
  (rgb) => rgb.map((channel) => channel.toString(16).padStart(2, "0")).join(""),
  (hex) => hex.match(/.{2}/g).map((channel) => parseInt(channel, 16)),
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
