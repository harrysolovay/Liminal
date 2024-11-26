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

Schema definitions effectively serve as additional context for the LLM. We may want to attach
context per-type to be used by OpenAI's services.

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

Parameterized context to be filled in later (even when contained within any number of wrapper
types). This simplifies reuse of types for different generation use cases.

```ts twoslash
import { T } from "structured-outputs"
// ---cut---
const Person = T.object({
  hometown: T.string`An ${"nationality"} city.`,
  favoriteFood: T.string`A delicious ${"nationality"} food.`,
})

const AmericanPerson = Person.fill({
  nationality: "American",
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

## Use Standalone JSON Schema

```ts twoslash
import { T } from "structured-outputs"
const Contact = T.object({
  name: T.string,
  phone: T.number,
  email: T.string,
})
declare function assertEquals<T>(expected: T, actual: T): void
// ---cut---
const schema = Contact.schema()

assertEquals(schema, {
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
