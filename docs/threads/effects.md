# Effects

```ts
import { branch, E, iter } from "liminal"

import { model } from "liminal/openai"
import OpenAI from "openai"

const gpt4oMini = model(new OpenAI(), "gpt-4o-mini")

function* Child() {
  yield E("info")

  if (Math.random() < .5) {
    yield E("error", {
      reason: "random",
    })
  }

  return "Hello!"
}

function* Parent() {
  const a = yield* branch("child", Child())
  a satisfies string

  const b = yield* branch("child", Child())["?"]("error")
  b satisfies string | { reason: string }
}
```
