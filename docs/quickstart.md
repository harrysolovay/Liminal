# Quickstart

Let's generate super-powered characters.

## 1. Create the `Character` Type

```ts twoslash include supe
import { L } from "liminal"

const Character = L.object({
  name: L.string`The character's name.`,
  role: L.enum("Hero", "Villain", "Indifferent"),
  power: L.string`The name of a supernatural ability.`,
})`A super-powered character.`
```

## 2. Create a `ResponseFormat`

```ts twoslash include supe-rf
// @include: supe
// ---cut--
import { OpenAIResponseFormat } from "liminal"

// ---cut---
const response_format = OpenAIResponseFormat("create_characters", L.array(Character))`
  A list of characters in a story.
`
```

## 3. Request and Unwrap The Completion

Send the completion request via OpenAI's [JavaScript client](https://github.com/openai/openai-node)
and parse the inner data into a typed object.

```ts{4,7} twoslash
// @include: supe-rf
import Openai from "openai"
declare const openai: Openai
// ---cut---
const supe = await openai.chat.completions
  .create({
    model: "gpt-4o-mini",
    response_format,
    messages: [{ role: "system", content: [] }],
  })
  .then(response_format.deserialize)

supe
// ^?
```

<br />
<br />
<br />
<br />
<br />
<br />

## Example Output

`animal` may contain data similar to the following.

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
