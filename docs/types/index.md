# Types Overview

Encode JSON Schema

Custom inspect

Display Signature

Serializing and Hydrating TypeJson

toJSON

fromJson

Arbitrary Metadata

Runtime representations of types (`Type`s) can be accessed on `T`, which is exported from the entry
point of `structured-outputs`.

```ts twoslash
import { T } from "structured-outputs"
```

Every `Type` has two type parameters:

- `T`: The native TypeScript type to which the response data decodes.
- `P extends keyof any`: The literal types of context parameter keys (more on this
  [in the context section](../context/parameters.md)).

## Context
