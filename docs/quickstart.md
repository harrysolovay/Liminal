# Quickstart

Let's generate super-powered characters.

## 1. Create the `Character` Type

```ts twoslash include supe
import { T } from "structured-outputs"

const Character = T.object({
  name: T.string`The character's name.`,
  role: T.enum("Hero", "Villain", "Indifferent"),
  power: T.string`The name of a supernatural ability.`,
})`A super-powered character.`
```

## 2. Create a `ResponseFormat`

```ts twoslash include supe-rf
// @include: supe
// ---cut--
import { ResponseFormat } from "structured-outputs"

// ---cut---
const response_format = ResponseFormat("create_characters", T.array(Character))`
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
  .then(response_format.into)

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
