---
title: Overview
prev: false
next:
  title: Quickstart
  link: quickstart
---

# Structured Outputs TypeScript

A library for working with
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

[Full documentation of types &rarr;](./types.md)

## Context

Descriptions in schema definitions serve as additional context for the LLM. We may want to attach
context per-type.

```ts twoslash
import { T } from "structured-outputs"
// ---cut---
const Contact = T.object({
  name: T.string`
    Ensure normal length for a person's full name.
  `,
  phone: T.number`
    Ensure the format is that of a phone number.
  `,
  email: T.string`
    Ensure the format is that of an email address.
  `,
})`
  A collection of information common in contact cards.
`
```

## Parameterized Context

We can specify placeholders for context to be filled in later. This simplifies reuse of types for
different use cases.

```ts twoslash
import { T } from "structured-outputs"
// ---cut---
const nationality = Symbol()

const Person = T.object({
  hometown: T.string`An ${nationality} city.`,
  favoriteFood: T.string`A delicious ${nationality} food.`,
})`An ${nationality} person.`

const AmericanPerson = Person.fill({
  [nationality]: "American",
})
```

## `ResponseFormat`

Create `ResponseFormat` for use with OpenAI clients.

```ts{1-3,7} twoslash
import Openai from "openai"
import { ResponseFormat, T } from "structured-outputs"
declare const openai: Openai
const Contact = T.object({
  name: T.string,
  phone: T.number,
  email: T.string,
})
// ---cut---
const response_format = ResponseFormat("extract_contact_information", Contact)`
  The contact information extracted from the supplied text.
`

const contact = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  response_format,
  messages: [],
})
```

## Native TypeScript Types

Refer to the native typescript type.

```ts twoslash
import { T } from "structured-outputs"
const Contact = T.object({
  name: T.string,
  phone: T.number,
  email: T.string,
})
// ---cut---
function sendText(args: typeof Contact["T"]): void {
  //              ^?
  // ...
}
```

<br />
<br />

## Get Typed Objects

Utilize convenience methods to unwrap typed data directly from chat completion responses.

```ts twoslash
import Openai from "openai"
import { ResponseFormat, T } from "structured-outputs"

declare const openai: Openai

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
  .then(response_format.into)

contact
// ^?
```

<br />
<br />
<br />
<br />
