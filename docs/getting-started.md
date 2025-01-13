# Getting Started

## Installation

::: code-group

```sh [Node.js]
npm i liminal
```

```sh [Deno]
deno add jsr:@crosshatch/liminal
```

:::

## Debate

```ts
import { E, iter, T } from "liminal"

for await (const event of iter(Main())) {
  console.log(event)

  event satisfies {
    type: "topic" | "opening stance" | "opening argument" | "B's argument" | "A's argument"
    value: string
  }
}

function* Main() {
  yield "What is the topic of debate?"
  yield E("topic", yield* T.string)

  yield "What is the opening stance on this topic?"
  yield E("opening stance", yield* T.string)

  yield "What is the opening argument for this stance?"
  yield E("opening argument", yield* T.string)

  while (true) {
    yield "What is debater B's counter-argument?"
    yield E("B's argument", yield* T.string)

    yield "What is debater A's counter-argument?"
    yield E("A's argument", yield* T.string)
  }
}
```

## Declare Types

```ts twoslash include supe
import { L } from "liminal"

const Character = L.object({
  name: L.string,
  role: L.enum("Hero", "Villain", "Civilian"),
  power: L.Option(L.string`The name of a supernatural ability.`),
})
```

## `ResponseFormat`

```ts
import { OpenAIResponseFormat } from "liminal/openai"

const response_format = OpenAIResponseFormat(
  "characters",
  L.array(Character),
)
```

`response_format` can then be placed within completion request parameters, and subsequently used for
deserialization.

```ts {8,10}
const characters = await openai.chat.completions
  .create({
    model: "gpt-4o-mini",
    messages: [{
      role: "system",
      content: "",
    }],
    response_format,
  })
  .then(response_format.deserialize)
```

The value of `characters` should look similar to the following.

```jsonc
[
  {
    "name": "Echo",
    "role": "Hero",
    "power": "Sound Manipulation"
  },
  {
    "name": "The Puppeteer",
    "role": "Villain",
    "power": "Telekinesis"
  },
  {
    "name": "Glimmer",
    "role": "Hero",
    "power": "Light Generation"
  }
  // ...
]
```

## Next Steps

- [**For App Developers &rarr;**](./types/intrinsics)<br />Explore core types, starting with
  intrinsic types.
- [**For Library Developers &rarr;**](./libraries/index)<br />Learn about utilities and conventions
  for creating Liminal libraries.
- [**For Integration Developers &rarr;**](./libraries/visitor)<br /> learn how to operate on types
  and use `TypeVisitor` to analyze and transform types.
