# Context Chaining

The descriptions contained within your types serve as context for the LLM. It is for this reason
that the core unit of `structured-outputs`––`Ty`--is an infinitely-chainable tagged template
function.

```ts twoslash
import { T } from "structured-outputs"
// ---cut---
const A = T.string`A.`
const B = A`B.`
const C = B`C.`
```

The resulting description contained within the JSON Schema will contain the concatenated
descriptions.

```json
{
  "type": "string",
  "description": "C. B. A."
}
```

This enables us to attach additional context to any type.

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
