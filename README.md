# Structured Outputs TypeScript

> A library for working with OpenAI's structured outputs.

- [Documentation &rarr;](https://structured-outputs.dev)<br />Expanded introduction and usage
  instructions.
- [OpenAI Guide &rarr;](https://platform.openai.com/docs/guides/structured-outputs)<br />The OpenAI
  platform's guide on Structured Outputs
- [Pattern Libraries &rarr;](https://structured-outputs.dev/patterns)<br />Pattern libraries
  modeling common schemas using Structured Outputs TypeScript.

## Installation

### Node

```sh
npm i structured-outputs
```

### Deno

```ts
deno add jsr:@crosshatch/structured-outputs@0.1.0-beta.X
```

> Note: replace "X" with the latest beta version number. Version specificity will be unnecessary
> upon the first stable release of `structured-outputs`.

## Example Usage

### Declare a Type

```ts
import { T } from "structured-outputs"

const Character = T.object({
  name: T.string,
  age: T.number`Ensure between 1 and 110.`,
  home: T.string`The name of a fictional realm of magic and wonder.`,
  disposition: T.constantUnion("Optimistic", "Reserved", "Inquisitive"),
})
```

### Create a `ResponseFormat`

```ts
// ...

import { ResponseFormat } from "structured-outputs"

const response_format = ResponseFormat("create_character", Character)`
  Create a character to be the protagonist of a children's story.
`
```

### Create Chat Completions

```ts
// ...

const character = await openai.chat.completions
  .create({
    model: "gpt-4o-mini",
    messages: [...yourMessages],
    response_format,
  })
  .then(response_format.parseFirstChoice)
```

### Utilize The Typed, Unwrapped Data

```ts
// ...

character satisfies {
  name: string
  age: number
  home: string
  disposition: "Optimistic" | "Reserved" | "Inquisitive"
}
```

## License

Structured Outputs TypeScript is [Apache licensed](LICENSE).
