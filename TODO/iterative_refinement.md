## Iterative Refinement

Assertion annotations can contain runtime assertion functions. Upon receiving structured outputs,
clients can run these assertion functions and collect exceptions into diagnostic lists, to be sent
along with followup requests for corrections. This process can loop until all assertions pass,
iteratively piecing in valid data.

```ts
import { L, Liminal } from "liminal"
import { refine } from "liminal/openai"

const T = L.object({
  a: L.string,
  b: L.string,
})(L.assert(({ a, b }) => a.length > b.length, "`a` must be longer than `b`."))

const refined = await refine(openai, T, {
  max: 4,
})
```
