# `refine`

## Correctness vs. Speed

Common assertion failure patterns will produce schemas that get cached?

## Thresholds

We can limit the token consumption of an iterative refinement loop using `TokenAllowance`.

```ts twoslash
// @include: refine-month
import { RefineParams } from "structured-outputs"
declare const params: RefineParams
// ---cut---
import { TokenAllowance } from "structured-outputs"

const signal = new AbortSignal()

const max = 5

const allowance = new TokenAllowance({ total_tokens: 1000 })

refine(openai, params, {
  signal,
  max,
  allowance,
})
```
