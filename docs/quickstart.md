---
prev:
  text: Overview
  link: /
next:
  text: Types
  link: types
---

# Quickstart

## Installation

::: code-group

```sh [Node.js]
npm i structured-outputs
```

```sh [Deno]
deno add jsr:@crosshatch/structured-outputs@0.1.0-beta.X

# The following will work upon stabilization.
deno add jsr:@crosshatch/structured-outputs
```

:::

## Node.js-specific Setup

`structured-outputs`'s NPM package does not contain a CommonJS build; only ES Modules are supported.
Therefore, we must specify `module` as the value of the `package.json`'s `type` field.

`package.json`

```diff
{
  // ...
+ "type": "module"
}
```

## Basic Example

Let's say we're generating a superhero story. Let's create a type with which we can generate
character super-abled characters (`Supe`s):

```ts twoslash
import { ResponseFormat, T } from "structured-outputs"

const Supe = T.object({
  name: T.string`The super-abled character's name.`,
  role: T.enum("Hero", "Villain", "Indifferent"),
  age: T.number`Between 18 and 200 years of age.`,
  power: T.string`The name of a supernatural ability.`,
})
```

Create a `ResponseFormat` with the `Supe` type.

```ts twoslash
import { ResponseFormat, T } from "structured-outputs"

const Supe = T.object({
  name: T.string,
  role: T.enum("Hero", "Villain", "Indifferent"),
  age: T.number,
})
// ---cut---
const response_format = ResponseFormat("create_supe", Supe)
//    ^?
```

<br />
<br />
<br />
<br />
<br />
<br />

We can give a description to the response format if we so choose.

```ts twoslash
import { ResponseFormat, T } from "structured-outputs"

const Supe = T.object({
  name: T.string,
  role: T.enum("Hero", "Villain", "Indifferent"),
  age: T.number,
})
// ---cut---
const response_format = ResponseFormat("create_supe", Supe)`
  Information about a super-abled character.
`
```

Finally, send the completion request via the OpenAI TypeScript client, then use the
`ResponseFormat`'s `into` method to parse the inner JSON and deserialize any sub-values according to
the `T`-described type.

```ts{7} twoslash
import Openai from "openai"
import { ResponseFormat, T } from "structured-outputs"

declare const openai: Openai

declare const response_format: ResponseFormat<{
  name: string
  role: "Hero" | "Villain" | "Indifferent"
  age: number
}>
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
