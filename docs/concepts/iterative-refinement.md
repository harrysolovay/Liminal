# `refine`

## Correctness vs. Speed

Common assertion failure patterns will produce schemas that get cached?

## Thresholds

We can limit the token consumption of an iterative refinement loop using `TokenAllowance`.

```ts
import { refine, RefineParams } from "liminal"
import Openai from "openai"
declare const openai: Openai
declare const params: RefineParams
// ---cut---
import { TokenAllowance } from "liminal"

const signal = new AbortSignal()

const allowance = new TokenAllowance({ total_tokens: 1000 })

refine(openai, params, {
  signal,
  max: 5,
  allowance,
})
```
