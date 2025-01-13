# Stepping

```ts
import { branch, E, iter, T } from "liminal"
import { model } from "liminal/openai"
import OpenAI from "openai"

const gpt4oMini = model(new OpenAI(), "gpt-4o-mini")

for await (const event of iter(Parent(), gpt4oMini)) {
  console.log(event)
}

function* Parent() {
  yield "Why are you be sad?"
  const reason = yield* branch("child", Child())
  console.log(reason)
}

function* Child() {
  yield "Ensure the reason has to do with the loss of true love."
  return yield* L.string
}
```
