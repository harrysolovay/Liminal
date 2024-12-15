---
title: Overview
---

<!--@include: ./fragments.md-->

# Structured Outputs TypeScript

> A Framework for Integrating With
> [OpenAI structured outputs](https://platform.openai.com/docs/guides/structured-outputs).

OpenAI's structured outputs streamline the integration of LLMs into procedural code by ensuring that
completions adhere to a specified schema. While this feature provides developers with a valuable
predictability, it also introduces new challenges to managing and utilizing these outputs
effectively. **Structured Outputs TypeScript** is a framework for addressing these challenges:

## [Model Types &rarr;](./types/index.md)

```ts twoslash
// @include: animal

type Animal = typeof Animal["T"]
//   ^?
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

## [Create and Parse Completions &rarr;](./consumers/response-format.md)

```ts {3,9,11} twoslash
// @include: animal
// @include: openai
// ---cut---
import { ResponseFormat } from "liminal"

const response_format = ResponseFormat("generate_animal", Animal)

const animal = await openai.chat.completions
  .create({
    model: "gpt-4o-mini",
    messages: [{ role: "system", content: [] }],
    response_format,
  })
  .then(response_format.into)
```

## [Attach Context To Types &rarr;](./context/chaining.md)

We can treat any type as a tagged template function to attach descriptions that serve as additional
context to guide the LLM.

```ts twoslash {2}
// @include: L
// ---cut---
const Dog = L.object({
  toy: L.enum("Bone", "Shoe", "Homework")`The dog's preferred chew toy.`,
})
```

Context attachment can be chained, enabling us to legibly compose types with richer context.

```ts {12} twoslash
// @include: L
// @include: assert
// ---cut---
import { toSchema } from "liminal"

const song = L.string`A song.`

const hiphopSong = song`Genre is hip hop.`

const upliftingHipHopSong = hiphopSong`Ensure it is uplifting.`

const schema = upliftingHipHopSong.toJSON()

assertEquals(schema, {
  description: "A song. Genre is hip hop. Ensure it is uplifting.",
  type: "string",
})
```

## [Parameterize Context &rarr;](./context/parameters.md)

We can parameterize context to enable reuse of common types for different use case.

```ts twoslash include nationality-context-param
// @include: L
// ---cut---
// const key = Symbol()

// const Person = T.object({
//   hometown: T.string`${key} city.`,
//   favoriteFood: T.string`A delicious ${key} food.`,
// })`An ${key}.`
```

We can then utilize the parameterized type in different parts of our program.

```ts twoslash
// @include: nationality-context-param
// ---cut---
// const AmericanPerson = Person.of({
//   [key]: "American",
// })

// const AustralianPerson = Person.of({
//   [key]: "Australian",
// })
```

## [Iterative Refinement &rarr;](./consumers/refine.md)

OpenAI structured outputs are limited to a narrow subset of JSON schema.[^1] Moreover, developers
often need to constrain data types in ways that can only be represented at runtime; JSON Schema
alone is insufficient.

To address this shortcoming, we can attach assertions to types.

```ts twoslash include refine-month
// @include: T
// @include: assert
// ---cut---
const Month = T.integer`Positive, zero-based month of the gregorian calendar.`
  .assert(assertMin, 0)
  .assert(assertMax, 11)

function assertMin(value: number, min: number) {
  assert(value >= min, `Must be gte ${min}; received ${value}.`)
}

function assertMax(value: number, max: number) {
  assert(value <= max, `Must be lte ${max}; received ${value}.`)
}
```

We can then utilize `refine`, which gets the structured output and runs all type-specific
assertions. If any of the assertions throw errors, those errors are serialized into subsequent
requests for corrected values, which are then injected into the original structured output. We can
loop until all values satisfy their corresponding type's assertions.

```ts twoslash {5} include refine-month
// @include: refine-month
// @include: openai
// ---cut---
import { refine, ResponseFormat } from "liminal"

const response_format = ResponseFormat("month", Month)

const month = refine(openai, {
  model: "gpt-4o-mini",
  response_format,
  messages: [{ role: "system", content: [] }],
})
```

## [Adherence Assertions &rarr;](./consumers/assert-adherence.md)

Assertions can be asynchronous, which allows us to use natural language to reflect on whether a
value adheres to our expectations. This may be useful in cases involving agents specialized in
certain kinds of data.

```ts twoslash {2}
import { type AssertAdherence, T } from "liminal"
declare const assertAdherence: ReturnType<typeof AssertAdherence>
// ---cut---
const UpliftingSummary = T.string`A summary.`
  .assert(assertAdherence, "The summary is uplifting.")
```

[^1]: [OpenAI structured output backend limitations](https://platform.openai.com/docs/guides/structured-outputs#supported-schemas).
