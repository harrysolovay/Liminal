# Models

A model is an object that conforms to the `Model` interface, which is exported from `liminal`.

Liminal provides several model factories from the `ollama`, `openai` and `anthropic` package
subpaths.

For example, let's utilize the `openai` model factory to create a thread that generates a poem.

```ts
import { exec, L } from "liminal"
import { model } from "liminal/openai"
import OpenAI from "openai"

for await (const _ of exec(Poem)) {}

function* Poem() {
  yield* model(new OpenAI(), "gpt-4o-mini")

  yield "Select a topic for a poem."

  yield* L.string

  yield "Write a poem about that topic."

  const poem = yield* L.string

  console.log(poem)
}
```

We can utilize threads and joining to compare the output of multiple models. First, let's adjust the
`Poem` function to accept a model name and return the model name and poem.

```ts
const openai = new OpenAI()

function* Poem(name: string) {
  yield* model(openai, name)

  yield "Select a topic for a poem."

  yield* L.string

  yield "Write a poem about that topic."

  const poem = yield* L.string

  return [name, poem]
}
```

Now let's define a root thread that will create and join the `Poem` threads and then select the best
poem.

```ts
import { exec, join, L, thread } from "liminal"
import { model } from "liminal/openai"
import OpenAI from "openai"

for await (const _ of exec(BestPoem)) {}

function* BestPoem() {
  const poems = Object.fromEntries(
    yield* join(
      ...MODELS.map((name) => thread(name, Poem(name))),
    ),
  )

  yield "Which of the following poems is the most elegant?"

  yield JSON.stringify(poems)

  const model = yield* L.enum(...MODELS)

  console.log(poems[model])
}

const MODELS = ["gpt-4o-mini", "o1-preview", "gpt-4o"]
```
