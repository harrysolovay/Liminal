---
title: Overview
---

# Structured Outputs TypeScript

> A Framework for Integrating With
> [OpenAI structured outputs](https://platform.openai.com/docs/guides/structured-outputs).

OpenAI's structured outputs simplify the integration of LLMs into procedural code. Developers can
now ensure that completions conform to a specified JSON schema. However, this raw capability
presents subsequent challenges to developers. Structured Outputs TypeScript addresses these
challenges:

## Schema-modeling

```ts twoslash
import { T } from "structured-outputs"
// ---cut---
const Dog = T.object({
  toy: T.enum("Bone", "Shoe", "Homework"),
})

const Cow = T.object({
  miyazaki: T.boolean,
})

const Animal = T.taggedUnion("type", {
  Dog,
  Cow,
})

Animal
// ^?
```

<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />

[Full documentation of types &rarr;](./types/index.md)

## Context

We can treat any type as a tagged template function to attach descriptions that serve as additional
context to guide the LLM.

```ts{2} twoslash
import { T } from "structured-outputs"
// ---cut---
const Dog = T.object({
  toy: T.enum("Bone", "Shoe", "Homework")`The dog's preferred chew toy.`,
})
```

### Parameterized Context

We can describe the structure of commonly-used types and later inject context depending on the use
case.

```ts
const Person = T.object({
  hometown: T.string`An ${"nationality"} city.`,
  favoriteFood: T.string`A delicious ${"nationality"} food.`,
})`An ${nationality} person.`

const AmericanPerson = Person.fill({
  nationality: "American",
})
```

## Iterative Refinement

Standalone OpenAI structured outputs are limited to a narrow subset of JSON schema.[^1] Moreover,
developers often need to constrain data types in ways that can only be represented with runtime
code; JSON Schema alone is insufficient.

### LLM-Assisted Assertions

Using specialized agents to validate specialized data.

```ts twoslash
import { type AssertAdherence } from "structured-outputs"
```

Structured Outputs TypeScript allows developers to attach runtime assertions to types.

```ts{2} twoslash
import { type AssertAdherence, T } from "structured-outputs"
declare const assertAdherence: ReturnType<typeof AssertAdherence>
// ---cut---
const UpliftingSummary = T.string`A summary.`
  .assert(assertAdherence, "The summary is uplifting.")
```

> Assertions can be asynchronous. In this case, `assertAdherence` produces a promise that may reject
> with an `AssertionError`.

We then utilize `refine` to execute our completion request.

```ts twoslash
import Openai from "openai"
// import { refine, ResponseFormat, T } from "structured-outputs"

// const openai = new Openai()

// const response_format = ResponseFormat("refined_summary", Refined)

// const refined = await refine(openai, {
//   model: "gpt-4o-mini",
//   response_format,
//   messages: [{ role: "system", content: [] }],
// })
```

Upon receiving the structured output

```ts twoslash
import { T } from "structured-outputs"

const Contact = T.object({
  name: T.string,
  phone: T.number,
  email: T.string,
})
```

`structured-outputs` was designed to enable the creation of libraries that abstract over the core
types described in [the types section](./types/index.md). The aim is to enable an ecosystem of
reusable type libraries.

Such library types can have parameterized context, thereby enabling end developers to apply context
as necessary ([see context section](./context/parameters.md)).

## Requesting Patterns

If you have an idea for a `structured-outputs` pattern, please
[open an issue](https://github.com/harrysolovay/structured-outputs/issues/new).

If you've already created a library, please submit a pull request that adds it to the "Pattern
Libraries" list of this very documentation.

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

[^1]: [OpenAI structured output backend limitations](https://platform.openai.com/docs/guides/structured-outputs#supported-schemas).
