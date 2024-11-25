---
prev:
  text: Overview
  link: overview
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

The `structured-outputs` NPM package does not contain a CommonJS build; only ES Modules are
supported. Therefore, we must specify `module` as the value of the `package.json`'s `type` field.

```diff
{
  // ...
+ "type": "module"
}
```

## Basic Example

Let's generate a character with superpowers according to the following shape:

```ts twoslash
import { ResponseFormat, T } from "structured-outputs"

const Supe = T.object({
  name: T.string`The super-abled character's name.`,
  role: T.constantUnion("Hero", "Villain", "Indifferent"),
  age: T.number`Between 18 and 200 years of age.`,
})
```

Create a `ResponseFormat` with the `Supe` type.

```ts twoslash
import { ResponseFormat, T } from "structured-outputs"

const Supe = T.object({
  name: T.string,
  role: T.constantUnion("Hero", "Villain", "Indifferent"),
  age: T.number,
})
// ---cut---
const response_format = ResponseFormat("create_supe", Supe)
```

> Optionally give a description to the response format.
>
> ```ts
> const response_format = ResponseFormat("create_supe", Supe)`
>   Information about a super-abled character.
> `
> ```

Use your OpenAI client normally, then unwrap the structured output choice with
`response_format.parseFirstChoice`.

```ts twoslash
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
  .then(response_format.parseFirstChoice)

supe
// ^?
```

<br />
<br />
<br />
<br />
