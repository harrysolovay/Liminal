# Thread IDs

```ts
import { create, exec, threadId } from "liminal"

for await (const _ of exec(Main)) {}

function* Main() {
  yield* create("child", Child())
}

function* Child() {
  yield* create("grandchild", Grandchild())
}

function* Grandchild() {
  const id = yield* threadId()

  assertEquals(id, "child.grandchild")
}
```
