---
title: Overview
---

# Liminal <Badge type="warning" text="beta" />

Liminal is a TypeScript library that manages conversation state without obscuring underlying
structures (namely message lists). Conversations are modeled as pure generator functions, which can
contain local state, branching, parallelized child threads and other useful directives. One such
directive is `Type`, which can be yielded to generate and parse assistant messages into
statically-typed values.

```ts
import { L } from "liminal"

function* Conversation() {
  yield "What are two useful features of Liminal?"

  const [A, B] = yield* L.Tuple(L.string, L.string)

  A satisfies string
  B satisfies string
}
```

When executed, we can expect an underlying message list similar to the following.

```json
[
  {
    "role": "user",
    "body": "What are two useful features of Liminal?"
  },
  {
    "role": "assistant",
    "body": "['Conversation management.', 'Type-safe schema combinators.']"
  }
]
```

The conversation can be further controlled by yielding actions.

## Set Provider/Model

We can set the model at any point in a conversation.

```ts
import { L } from "liminal"
import { model } from "liminal/openai"

function* Main() {
  yield model("gpt-4o-mini")
  yield with4o = yield* L.string

  yield model("o1")
  yield withO1 = yield* L.string
}
```

## Create Child Threads

We can create child threads by yielding the result of `Thread.new`.

```ts
import { create, L } from "liminal"

function* Main() {
  const result = yield* create(
    "Haiku",
    Child("Why is the sky blue?"),
  )

  result satisfies string
}

function* Child(seed: string) {
  yield seed
  yield* L.string
  yield "Turn that into a haiku."
  return yield* L.string
}
```

## Branches

We can branch threads, thereby creating new threads with the same state. This is useful for a wide
range of use cases, such as exploring multiple paths of execution to decide which path is optimal.

```ts
import { branch } from "liminal"

function* Main() {
  yield "Give an example of an iconic 90s supernatural TV show."

  const { show, protagonist } = yield* branch("Child", Child())
}

function* Child() {
  const show = yield* L.string

  yield "Who is the protagonist of this show?"

  const protagonist = yield* L.string

  return { show, protagonist }
}
```

In this example, the conversation of `Main` includes the following initial message list.

```json
[
  {
    "role": "user",
    "body": "Give an example of an iconic 90s supernatural TV show."
  }
]
```

The `Child` branch inherits this list, and appends its own messages.

```json
[
  {
    "role": "user",
    "body": "Give an example of an iconic 90s supernatural TV show."
  },
  {
    "role": "assistant",
    "body": "Buffy the Vampire Slayer"
  },
  {
    "role": "user",
    "body": "Who is the protagonist of this show?"
  },
  {
    "role": "assistant",
    "body": "Buffy Summers"
  }
]
```

In the case that the brand (or any child thread) returns a value, that value is appended to the
parent's message list. In this example, we can expect the final message list of `Main` to look
similar to the following.

```json
[
  {
    "role": "user",
    "body": "Give an example of an iconic 90s supernatural TV show."
  },
  {
    "role": "assistant",
    "body": "{ 'show': 'Buffy the Vampire Slayer', 'protagonist': 'Buffy Summers' }"
  }
]
```

## Parallel Threads

We can execute child threads in parallel with `join`.

```ts
import { create, join } from "liminal"

function* Main() {
  const [A, B] = yield* join(
    create("A", Child("Why is the sky blue?")),
    create("B", Child("Why is the ocean blue?")),
  )
}

// ...
```

## Effects

Effects provide ancestor threads with the ability to observe waypoints in child threads. They also
allow for early termination in the case that the child thread's fulfillment is not required.

```ts
import { E, exec } from "liminal"

function* Main() {
  yield E("First")

  yield E("Second", { B: 2 })

  if (Math.random() > 0.5) {
    yield E("Third", { C: 3 })
  }
}

for await (const e of exec(Main())) {
  e satisfies {
    type: "First"
    value?: undefined
  } | {
    type: "Second"
    value: { B: number }
  } | {
    type: "Third"
    value: { C: number }
  }
}
```

## [Model Types and Generate Values](./types/index.md)

Use Liminal types as structured output schemas. Static types are inferred.

```ts
import { L } from "liminal"

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
