# Composing Context

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
