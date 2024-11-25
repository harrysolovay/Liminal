# Structured Outputs TypeScript

`structured-outputs` is a library for working with
[OpenAI structured outputs](https://platform.openai.com/docs/guides/structured-outputs).

## Overview

Developers compose representations of types.

```ts twoslash
import { T } from "structured-outputs"

const Contact = T.object({
  name: T.string,
  phone: T.number,
  email: T.string,
})
```

> See docs for...
>
> - [Primitive Types](primitive-types.md)
> - [Composite Types](composite-types.md)

## Context

When using OpenAI Structured Outputs, the response format or tool definition effectively serves as
context for the LLM. We may want to attach context per-type to be used by OpenAI's services.

```ts twoslash
import { T } from "structured-outputs"
// ---cut---
const Contact = T.object({
  name: T.string`Ensure normal length for a person's full name.`,
  phone: T.number`Ensure the format is that of a phone number.`,
  email: T.string`Ensure the format is that of an email address.`,
})`
  A collection of information common in contact cards.
`
```

## `ResponseFormat`

We create the `ResponseFormat` to be used with the OpenAI client.

```ts twoslash
import { T } from "structured-outputs"
const Contact = T.object({
  name: T.string,
  phone: T.number,
  email: T.string,
})
// ---cut---
import { ResponseFormat } from "structured-outputs"

const response_format = ResponseFormat("extract_contact_information", Contact)`
  The contact information extracted from the supplied text.
`
```

## Extract Native TypeScript Type

Code that depends on the structured output data can reference the type definitions at the
type-level.

```ts twoslash
import { T } from "structured-outputs"
const Contact = T.object({
  name: T.string,
  phone: T.number,
  email: T.string,
})
// ---cut---
function sendText(args: typeof Contact["T"]): void {
  // ...
}
```

## Parse Typed Objects

We can utilize convenience methods of `ResponseFormat` instances to unwrap typed choice data from
chat completion responses.

```ts twoslash
import Openai from "openai"
import { ResponseFormat, T } from "structured-outputs"

declare const OPENAI_API_KEY: string
export const openai = new Openai({ apiKey: OPENAI_API_KEY })

const response_format = ResponseFormat(
  "",
  T.object({
    name: T.string,
    phone: T.number,
    email: T.string,
  }),
)
// ---cut---
const contact = await openai.chat.completions
  .create({
    model: "gpt-4o-mini",
    response_format,
    messages: [
      {
        role: "user",
        content: [{
          type: "text",
          text: `
            Extract data from the following message:

            Please call John Doe at 555-123-4567 or email him at john.doe@example.com.
          `,
        }],
      },
    ],
  })
  .then(response_format.parseFirstChoice)

contact satisfies {
  name: string
  phone: number
  email: string
}
```

## Generating Standalone JSON Schemas

```ts twoslash
import { T } from "structured-outputs"
const Contact = T.object({
  name: T.string,
  phone: T.number,
  email: T.string,
})
declare function assertEquals<T>(expected: T, actual: T): void
// ---cut---
assertEquals(Contact.schema(), {
  type: "object",
  properties: {
    name: {
      type: "string",
      description: "Ensure normal length for a person's full name.",
    },
    phone: {
      type: "number",
      description: "Ensure the format is that of a phone number.",
    },
    email: {
      type: "string",
      description: "Ensure the format is that of an email address.",
    },
  },
  additionalProperties: false,
  required: ["name", "phone", "email"],
})
```
