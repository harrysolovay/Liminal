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

**For app developers**: explore core types, starting with [intrinsic types](./types/intrinsics).

**For library developers**: read [the library guide](./types/libraries).

**For integration developers**: learn how to use [`TypeVisitor`](./types/visitor) to both analyze
types and transform them into other representations.
