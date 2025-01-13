You’re able to express chaining with structured output in a minimal format. While you could wrap
provider-specific client usage to do this, you’d then be bound to the given provider. With Liminal,
the provider is inherited from whatever ancestor yielded the model, so we can create this reusable
block the expresses the desired chaining, and then use it with any LLM.

Generators are great for managing threads because they allow pure branching of conversations, so
that you can explore different conversation states in parallel and then merge them, bubbling up
those merges or other results back to the parent generator. This also makes sense from the
perspective of bubbling up events for reactive systems.

Wanting to maintain as much context as possible for the given model. And only clipping the message
history on-demand and only for the sake of submission.

## Iterative Refinement

Assertion annotations can contain runtime assertion functions. Upon receiving structured outputs,
clients can run these assertion functions and collect exceptions into diagnostic lists, to be sent
along with followup requests for corrections. This process can loop until all assertions pass,
iteratively piecing in valid data.

Ability to watch thread play out with many different models in parallel (we can then question why a
give turn was taken / is different from the adjacent run)

Answer why generators better

- Allow us to observe each update to the message state. Makes debugging breezy.

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

What role do assertions play in the type system?

```ts
const RGBColorChannel = L.number(min(0), max(255))`A channel of an RGB color triple.`
```
