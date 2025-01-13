# Threads

## System Prompt

```ts
import { system, T, thread } from "liminal"

function* Main() {
  yield* thread("root", Debate())
}

function* Debate() {
  yield system`
    Moderate a debate between two users.
  `

  // ...
}
```

## Thread ID

```ts
import { thread, threadId } from "liminal"

function* Main() {
  yield* thread("child", Child())
}

function* Child() {
  yield* thread("grandchild", Grandchild())
}

function* Grandchild() {
  const id = yield* threadId()
  console.log(id)
}
```
