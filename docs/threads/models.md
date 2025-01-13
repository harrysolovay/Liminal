# Models

```ts
import { all, exec, T } from "liminal"
import { model } from "liminal/openai"
import OpenAI from "openai"

const openai = new OpenAI()

await exec(BestModel, model(openai, ""))

function* BestModel() {
  yield "Which of the following replies is the most elegant?"
  const results = yield* all(models.map((m) =>
    thread(m, function*() {
      yield model(openai, m)
      yield "How are you today?"
      yield* T.string
    })
  ))
  return yield* T.enum(...models)
}

const models = ["gpt-4o-mini", "o1-preview", "gpt-4o"]
```
