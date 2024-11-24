# Usage

## Basic Usage

```ts
import { ResponseFormat, T } from "structured-outputs"

// 1. Define the shape of the desired response.
const Character = T.object({
  name: T.string,
  age: T.number`Ensure between 1 and 110.`,
})

// 2. Create the response format object.
const response_format = ResponseFormat("create_character", Character)

// 3. Utilize the response format to create a chat completion.
const response = await openai.chat.completions.create({
  model: MODEL,
  messages: [{ role: "system", content: [] }],
  response_format,
})

// 4. Use `response_format.parseFirstOrThrow` to unwrap the inner data with correct types.
const { name, age } = response_format.parseFirstOrThrow(response)
```

For more concise usage, chain off the completions promise.

```ts
const { name, age } = await openai.chat.completions
  .create({
    model: MODEL,
    messages: [{ role: "system", content: [] }],
    response_format,
  })
  .then(response_format.parseFirstOrThrow)
```

We can also attach a description to the response format.

```diff
- ResponseFormat("create_character", Character)
+ ResponseFormat("create_character", Character)`
+   Create a new character to be the protagonist of a children's story.
+ `
```

### Dependency Injection

```ts
const Character = T.object({
  name: T.string`Preferably names common to those who are {"national identity"}.`,
  age: T.number`Ensure between 1 and 110.`,
})

const AmericanCharacter = Character.apply({
  "national identity": "american",
})
```