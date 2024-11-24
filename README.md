# Structured Outputs TypeScript

A library for composing
[OpenAI structured output schemas](https://platform.openai.com/docs/guides/structured-outputs).

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

## Example

```ts
import { ResponseFormat, T } from "structured-outputs"

const Character = T.object({
  name: T.string,
  age: T.number`Ensure between 1 and 110.`,
  home: T.string`The name of a fictional realm of magic and wonder.`,
  disposition: T.literalUnion("Optimistic", "Reserved", "Inquisitive"),
})

const response_format = ResponseFormat("create_character", Character)`
  Create a character to be the protagonist of a children's story.
`

const character = await openai.chat.completions
  .create({
    model: "gpt-4o-mini",
    messages: [...yourMessages],
    response_format,
  })
  .then(response_format.parseFirstChoice)

character satisfies {
  name: string
  age: number
  home: string
  disposition: "Optimistic" | "Reserved" | "Inquisitive"
}
```

## License

Structured Outputs TypeScript is [Apache licensed](LICENSE).
